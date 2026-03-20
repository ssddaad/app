/**
 * 身份验证控制器
 *
 * 处理用户注册、登录、验证码发送等认证相关请求
 */

import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { v4 as uuidv4 } from 'uuid';
import UserModel, { User as UserType } from '../models/user.model';
import {
  hashPassword,
  comparePassword,
  generateTokenPair,
  generateVerificationCode,
  verifyRefreshToken,
  maskPhoneNumber,
} from '../utils/auth.utils';
import { sendVerificationCode } from '../services/sms.service';
import { getRedisClient, redisKeys, redisTTL } from '../config/redis';
import logger from '../utils/logger';
import { AppError } from '../middleware/error.middleware';
import { asyncHandler } from '../middleware/error.middleware';

const isProd = process.env.NODE_ENV === 'production';

/** 登录连续失败上限（超出后锁定账号 30 分钟） */
const MAX_LOGIN_ATTEMPTS = 5;

// ─── 注册 ──────────────────────────────────────────────────────────────────────

/**
 * POST /api/auth/register
 */
export const register = asyncHandler(async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new AppError('请求参数验证失败', 400, errors.array());
  }

  const { phone, password, nickname } = req.body;

  const existingUser = await UserModel.findByPhone(phone);
  if (existingUser) throw new AppError('该手机号已被注册', 409);

  const nicknameTaken = await UserModel.isNicknameTaken(nickname);
  if (nicknameTaken) throw new AppError('该昵称已被使用', 409);

  const passwordHash = await hashPassword(password);

  const user = await UserModel.create({
    id: uuidv4(),
    phone,
    nickname,
    password_hash: passwordHash,
    status: 'active',
    created_at: new Date(),
    updated_at: new Date(),
  });

  logger.info('User registered', {
    userId: user.id,
    phone: maskPhoneNumber(phone),
    ip: req.clientIp,
  });

  res.status(201).json({
    success: true,
    message: '注册成功',
    data: { user: user.toPublicJSON() },
    timestamp: new Date().toISOString(),
    requestId: req.requestId,
  });
});

// ─── 登录 ──────────────────────────────────────────────────────────────────────

/**
 * POST /api/auth/login
 *
 * 支持两种方式：
 * 1. 用户名 + 密码
 * 2. 手机号 + 验证码
 *
 * 安全机制：连续失败 MAX_LOGIN_ATTEMPTS 次后锁定 30 分钟。
 */
export const login = asyncHandler(async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new AppError('请求参数验证失败', 400, errors.array());
  }

  const { username, password, phone, code } = req.body;
  const redisClient = getRedisClient();

  let user: UserType | null = null;
  let loginMethod = '';

  // ── 方式 1：用户名 + 密码 ────────────────────────────────────────────────────
  if (username && password) {
    loginMethod = 'password';

    // 检查账号是否已被锁定
    const attemptsKey = redisKeys.loginAttempts(username);
    const attemptsRaw = await redisClient.get(attemptsKey);
    const attempts = attemptsRaw ? parseInt(attemptsRaw, 10) : 0;

    if (attempts >= MAX_LOGIN_ATTEMPTS) {
      logger.warn('Account locked due to too many failed attempts', {
        username,
        ip: req.clientIp,
      });
      throw new AppError(
        `登录失败次数过多，账号已锁定，请 30 分钟后重试`,
        429,
      );
    }

    user = await UserModel.findByNickname(username);

    if (!user || !(await comparePassword(password, user.password_hash))) {
      // 记录失败次数
      await redisClient.setEx(
        attemptsKey,
        redisTTL.LOGIN_ATTEMPTS,
        String(attempts + 1),
      );
      logger.warn('Failed login attempt', { username, ip: req.clientIp });
      throw new AppError('用户名或密码错误', 401);
    }

    // 登录成功，清除失败计数
    await redisClient.del(attemptsKey);
  }
  // ── 方式 2：手机号 + 验证码 ──────────────────────────────────────────────────
  else if (phone && code) {
    loginMethod = 'sms_code';

    const codeKey = redisKeys.verificationCode(phone, 'login');
    const storedCode = await redisClient.get(codeKey);

    if (!storedCode || storedCode !== code) {
      throw new AppError('验证码错误或已过期', 401);
    }

    // 验证码一次性使用，立即删除
    await redisClient.del(codeKey);

    user = await UserModel.findByPhone(phone);
    if (!user) throw new AppError('用户不存在，请先注册', 404);
  } else {
    throw new AppError('请提供用户名和密码，或手机号和验证码', 400);
  }

  // ── 用户状态检查 ─────────────────────────────────────────────────────────────
  if (user.status === 'suspended') throw new AppError('账号已被封禁，请联系客服', 403);
  if (user.status === 'inactive')  throw new AppError('账号未激活', 403);

  // 更新最后登录时间
  await UserModel.updateLastLogin(user.id);

  const tokens = generateTokenPair(user.id, user.phone, user.nickname);

  logger.info('User logged in', {
    userId: user.id,
    method: loginMethod,
    ip: req.clientIp,
  });

  res.status(200).json({
    success: true,
    message: '登录成功',
    data: {
      user: user.toPublicJSON(),
      tokens: {
        accessToken:  tokens.accessToken,
        refreshToken: tokens.refreshToken,
        expiresIn:    tokens.expiresIn,
      },
    },
    timestamp: new Date().toISOString(),
    requestId: req.requestId,
  });
});

// ─── 发送验证码 ────────────────────────────────────────────────────────────────

/**
 * POST /api/auth/send-code
 */
export const sendCode = asyncHandler(async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new AppError('请求参数验证失败', 400, errors.array());
  }

  const { phone, scene } = req.body;
  const redisClient = getRedisClient();

  // 场景合法性校验
  const validScenes = ['login', 'register', 'reset_password'] as const;
  if (!validScenes.includes(scene)) throw new AppError('无效的场景参数', 400);

  // 注册场景：手机号不能已存在
  if (scene === 'register') {
    if (await UserModel.isPhoneRegistered(phone)) throw new AppError('该手机号已被注册', 409);
  }

  // 登录 / 重置密码：用户必须存在
  if (scene === 'login' || scene === 'reset_password') {
    if (!(await UserModel.isPhoneRegistered(phone))) throw new AppError('该手机号未注册', 404);
  }

  // 发码频率限制：60 秒冷却
  const rateLimitKey = redisKeys.sendCodeRateLimit(phone);
  const lastSentStr  = await redisClient.get(rateLimitKey);
  if (lastSentStr) {
    const waitSeconds = Math.ceil(
      (redisTTL.SEND_CODE_COOLDOWN * 1000 - (Date.now() - parseInt(lastSentStr, 10))) / 1000,
    );
    if (waitSeconds > 0) throw new AppError(`请 ${waitSeconds} 秒后再试`, 429);
  }

  const code = generateVerificationCode(6);

  // 存入 Redis
  const codeKey = redisKeys.verificationCode(phone, scene);
  await redisClient.setEx(codeKey, redisTTL.VERIFICATION_CODE, code);
  await redisClient.setEx(rateLimitKey, redisTTL.SEND_CODE_COOLDOWN, Date.now().toString());

  // 发送短信
  const smsResult = await sendVerificationCode(phone, code, scene);

  if (!smsResult.success) {
    logger.error('Failed to send SMS:', smsResult.error);

    // 生产环境：绝不返回验证码，直接报错
    if (isProd) throw new AppError('验证码发送失败，请稍后重试', 500);

    // 开发环境：返回验证码方便联调
    res.status(200).json({
      success: true,
      message: '验证码已生成（开发模式，SMS 发送失败）',
      data: { code, expiresIn: redisTTL.VERIFICATION_CODE },
      timestamp: new Date().toISOString(),
      requestId: req.requestId,
    });
    return;
  }

  logger.info('Verification code sent', {
    phone: maskPhoneNumber(phone),
    scene,
    messageId: smsResult.messageId,
  });

  res.status(200).json({
    success: true,
    message: '验证码已发送',
    data: {
      expiresIn: redisTTL.VERIFICATION_CODE,
      // 开发环境且 SMS 发送成功时也可返回，方便调试
      ...(!isProd && { code }),
    },
    timestamp: new Date().toISOString(),
    requestId: req.requestId,
  });
});

// ─── 获取当前用户 ──────────────────────────────────────────────────────────────

/**
 * GET /api/auth/user
 */
export const getUser = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) throw new AppError('用户未登录', 401);

  res.status(200).json({
    success: true,
    message: '获取成功',
    data: { user: req.user.toFullJSON() },
    timestamp: new Date().toISOString(),
    requestId: req.requestId,
  });
});

// ─── 刷新令牌 ──────────────────────────────────────────────────────────────────

/**
 * POST /api/auth/refresh
 */
export const refreshToken = asyncHandler(async (req: Request, res: Response) => {
  const { refreshToken: token } = req.body;
  if (!token) throw new AppError('未提供刷新令牌', 400);

  const decoded = verifyRefreshToken(token);
  if (!decoded) throw new AppError('刷新令牌无效或已过期', 401);

  const user = await UserModel.findByPk(decoded.id);
  if (!user || user.status !== 'active') throw new AppError('用户不存在或已被禁用', 401);

  const tokens = generateTokenPair(user.id, user.phone, user.nickname);

  logger.info('Token refreshed', { userId: user.id, ip: req.clientIp });

  res.status(200).json({
    success: true,
    message: '令牌刷新成功',
    data: {
      tokens: {
        accessToken:  tokens.accessToken,
        refreshToken: tokens.refreshToken,
        expiresIn:    tokens.expiresIn,
      },
    },
    timestamp: new Date().toISOString(),
    requestId: req.requestId,
  });
});

// ─── 登出 ──────────────────────────────────────────────────────────────────────

/**
 * POST /api/auth/logout
 */
export const logout = asyncHandler(async (req: Request, res: Response) => {
  if (req.user) {
    logger.info('User logged out', { userId: req.user.id, ip: req.clientIp });
  }
  res.status(200).json({
    success: true,
    message: '登出成功',
    timestamp: new Date().toISOString(),
    requestId: req.requestId,
  });
});

// ─── 修改密码 ──────────────────────────────────────────────────────────────────

/**
 * POST /api/auth/change-password
 */
export const changePassword = asyncHandler(async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) throw new AppError('请求参数验证失败', 400, errors.array());

  const user = req.user;
  if (!user) throw new AppError('用户未登录', 401);

  const { oldPassword, newPassword } = req.body;

  const passwordMatch = await comparePassword(oldPassword, user.password_hash);
  if (!passwordMatch) throw new AppError('原密码错误', 401);

  const newPasswordHash = await hashPassword(newPassword);
  await user.update({ password_hash: newPasswordHash, updated_at: new Date() });

  logger.info('Password changed', { userId: user.id, ip: req.clientIp });

  res.status(200).json({
    success: true,
    message: '密码修改成功',
    timestamp: new Date().toISOString(),
    requestId: req.requestId,
  });
});

// ─── 重置密码 ──────────────────────────────────────────────────────────────────

/**
 * POST /api/auth/reset-password
 */
export const resetPassword = asyncHandler(async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) throw new AppError('请求参数验证失败', 400, errors.array());

  const { phone, code, newPassword } = req.body;
  const redisClient = getRedisClient();

  const codeKey   = redisKeys.verificationCode(phone, 'reset_password');
  const storedCode = await redisClient.get(codeKey);

  if (!storedCode || storedCode !== code) throw new AppError('验证码错误或已过期', 401);

  await redisClient.del(codeKey);

  const user = await UserModel.findByPhone(phone);
  if (!user) throw new AppError('用户不存在', 404);

  const newPasswordHash = await hashPassword(newPassword);
  await user.update({ password_hash: newPasswordHash, updated_at: new Date() });

  logger.info('Password reset', {
    userId: user.id,
    phone: maskPhoneNumber(phone),
    ip: req.clientIp,
  });

  res.status(200).json({
    success: true,
    message: '密码重置成功',
    timestamp: new Date().toISOString(),
    requestId: req.requestId,
  });
});

// ─── 更新用户信息 ──────────────────────────────────────────────────────────────

/**
 * PUT /api/auth/user
 */
export const updateUser = asyncHandler(async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) throw new AppError('请求参数验证失败', 400, errors.array());

  const user = req.user;
  if (!user) throw new AppError('用户未登录', 401);

  const { nickname, avatar_url } = req.body;

  if (nickname && nickname !== user.nickname) {
    if (await UserModel.isNicknameTaken(nickname)) throw new AppError('该昵称已被使用', 409);
  }

  const updateData: Record<string, unknown> = { updated_at: new Date() };
  if (nickname)    updateData.nickname    = nickname;
  if (avatar_url)  updateData.avatar_url  = avatar_url;

  await user.update(updateData);

  logger.info('User profile updated', {
    userId: user.id,
    ip: req.clientIp,
    changes: Object.keys(updateData).filter((k) => k !== 'updated_at'),
  });

  res.status(200).json({
    success: true,
    message: '用户信息更新成功',
    data: { user: user.toFullJSON() },
    timestamp: new Date().toISOString(),
    requestId: req.requestId,
  });
});
