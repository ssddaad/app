/**
 * 身份验证工具函数
 *
 * 提供密码哈希、JWT 生成与验证等核心安全功能
 */

import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { randomInt, randomBytes } from 'crypto';
import config from '../config/config';
import { JWTPayload } from '../types/express';
import logger from './logger';

// ─── 密码处理 ─────────────────────────────────────────────────────────────────

/**
 * 密码哈希
 *
 * 使用 bcrypt 对明文密码进行哈希，盐值轮数由配置决定（生产环境最低 12）。
 */
export const hashPassword = async (password: string): Promise<string> => {
  try {
    return await bcrypt.hash(password, config.bcrypt.saltRounds);
  } catch (error) {
    logger.error('Password hashing error:', error);
    throw new Error('Failed to hash password');
  }
};

/**
 * 密码比对
 *
 * bcrypt.compare 内部使用恒定时间算法，天然防御时序攻击。
 */
export const comparePassword = async (
  password: string,
  hash: string,
): Promise<boolean> => {
  try {
    return await bcrypt.compare(password, hash);
  } catch (error) {
    logger.error('Password comparison error:', error);
    return false;
  }
};

// ─── JWT ─────────────────────────────────────────────────────────────────────

/**
 * 生成 JWT 访问令牌
 */
export const generateToken = (
  payload: Omit<JWTPayload, 'iat' | 'exp'>,
): string => {
  return jwt.sign(payload, config.jwt.secret, {
    expiresIn: config.jwt.expiration as jwt.SignOptions['expiresIn'],
    issuer: 'auth-api',
    audience: 'auth-api-client',
  });
};

/**
 * 生成 JWT 刷新令牌（长期，7 天）
 */
export const generateRefreshToken = (userId: string): string => {
  return jwt.sign(
    { id: userId, type: 'refresh' },
    config.jwt.refreshSecret,
    {
      expiresIn: config.jwt.refreshExpiration as jwt.SignOptions['expiresIn'],
      issuer: 'auth-api',
      audience: 'auth-api-client',
    },
  );
};

/**
 * 验证 JWT 访问令牌
 *
 * @returns 解码载荷，验证失败返回 null
 */
export const verifyToken = (token: string): JWTPayload | null => {
  try {
    return jwt.verify(token, config.jwt.secret, {
      issuer: 'auth-api',
      audience: 'auth-api-client',
    }) as JWTPayload;
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      logger.debug('Access token expired');
    } else if (error instanceof jwt.JsonWebTokenError) {
      logger.debug('Invalid access token');
    } else {
      logger.error('Token verification error:', error);
    }
    return null;
  }
};

/**
 * 验证 JWT 刷新令牌
 *
 * @returns 包含用户 ID 的对象，验证失败返回 null
 */
export const verifyRefreshToken = (token: string): { id: string } | null => {
  try {
    const decoded = jwt.verify(token, config.jwt.refreshSecret, {
      issuer: 'auth-api',
      audience: 'auth-api-client',
    }) as { id: string; type: string };

    if (decoded.type !== 'refresh') {
      logger.warn('verifyRefreshToken: invalid token type');
      return null;
    }

    return { id: decoded.id };
  } catch (error) {
    logger.debug('Refresh token verification failed:', error);
    return null;
  }
};

// ─── 令牌对 ───────────────────────────────────────────────────────────────────

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
  /** 访问令牌有效期（秒） */
  expiresIn: number;
}

/**
 * 同时生成访问令牌 + 刷新令牌
 */
export const generateTokenPair = (
  userId: string,
  phone: string,
  nickname: string,
): TokenPair => {
  const payload = { id: userId, phone, nickname };
  const accessToken = generateToken(payload);
  const refreshToken = generateRefreshToken(userId);

  const decoded = jwt.decode(accessToken) as { exp: number; iat: number };
  const expiresIn = decoded.exp - decoded.iat;

  return { accessToken, refreshToken, expiresIn };
};

// ─── 验证码 ───────────────────────────────────────────────────────────────────

/**
 * 生成数字验证码
 *
 * 使用 Node.js `crypto.randomInt`（基于 CSPRNG），替代不安全的 Math.random()。
 *
 * @param length 验证码位数，默认 6
 */
export const generateVerificationCode = (length = 6): string => {
  const min = 10 ** (length - 1);
  const max = 10 ** length; // exclusive upper bound for randomInt
  return randomInt(min, max).toString();
};

// ─── 通用令牌 / ID ────────────────────────────────────────────────────────────

/**
 * 生成密码学安全的随机令牌（32 字节 hex）
 */
export const generateRandomToken = (): string => {
  return randomBytes(32).toString('hex');
};

/**
 * 生成请求追踪 ID（16 字节 hex）
 */
export const generateRequestId = (): string => {
  return randomBytes(16).toString('hex');
};

// ─── 辅助工具 ─────────────────────────────────────────────────────────────────

/**
 * 恒定时间字符串比较，防止时序攻击
 */
export const secureCompare = (a: string, b: string): boolean => {
  if (a.length !== b.length) return false;
  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return result === 0;
};

/**
 * 校验密码强度
 */
export const validatePasswordStrength = (
  password: string,
): { valid: boolean; message: string } => {
  if (password.length < 8)
    return { valid: false, message: '密码长度至少为 8 个字符' };
  if (!/[A-Z]/.test(password))
    return { valid: false, message: '密码必须包含至少一个大写字母' };
  if (!/[a-z]/.test(password))
    return { valid: false, message: '密码必须包含至少一个小写字母' };
  if (!/\d/.test(password))
    return { valid: false, message: '密码必须包含至少一个数字' };
  if (!/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>\/?]/.test(password))
    return { valid: false, message: '密码必须包含至少一个特殊字符' };

  return { valid: true, message: '密码强度符合要求' };
};

/**
 * 校验中国大陆手机号格式
 */
export const isValidPhoneNumber = (phone: string): boolean =>
  /^1[3-9]\d{9}$/.test(phone);

/**
 * 掩码手机号（保留前三位和后四位）
 */
export const maskPhoneNumber = (phone: string): string => {
  if (!phone || phone.length !== 11) return phone;
  return phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2');
};
