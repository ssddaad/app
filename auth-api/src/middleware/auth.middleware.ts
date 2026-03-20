/**
 * 身份验证中间件
 *
 * 提供 JWT 认证、请求追踪、客户端 IP 获取等功能
 */

import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/auth.utils';
import UserModel from '../models/user.model';
import logger from '../utils/logger';
import { generateRequestId } from '../utils/auth.utils';

/**
 * JWT 认证中间件
 */
export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      res.status(401).json({ success: false, message: '未提供认证令牌', timestamp: new Date().toISOString() });
      return;
    }

    if (!authHeader.startsWith('Bearer ')) {
      res.status(401).json({ success: false, message: '认证令牌格式错误，应为 Bearer 格式', timestamp: new Date().toISOString() });
      return;
    }

    const token = authHeader.substring(7);

    if (!token) {
      res.status(401).json({ success: false, message: '认证令牌为空', timestamp: new Date().toISOString() });
      return;
    }

    const decoded = verifyToken(token);

    if (!decoded) {
      res.status(401).json({ success: false, message: '认证令牌无效或已过期', timestamp: new Date().toISOString() });
      return;
    }

    const user = await UserModel.findByPk(decoded.id);

    if (!user) {
      res.status(401).json({ success: false, message: '用户不存在', timestamp: new Date().toISOString() });
      return;
    }

    if (user.status === 'suspended') {
      res.status(403).json({ success: false, message: '账号已被封禁，请联系客服', timestamp: new Date().toISOString() });
      return;
    }

    if (user.status === 'inactive') {
      res.status(403).json({ success: false, message: '账号未激活，请先完成激活', timestamp: new Date().toISOString() });
      return;
    }

    req.user = user;
    next();
  } catch (error) {
    logger.error('Authentication error:', error);
    res.status(500).json({ success: false, message: '认证过程中发生错误', timestamp: new Date().toISOString() });
  }
};

/**
 * 可选认证中间件（验证失败不阻止请求）
 */
export const optionalAuthenticate = async (
  req: Request,
  _res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      next();
      return;
    }

    const token = authHeader.substring(7);
    const decoded = verifyToken(token);

    if (decoded) {
      const user = await UserModel.findByPk(decoded.id);
      if (user && user.status === 'active') {
        req.user = user;
      }
    }

    next();
  } catch {
    next();
  }
};

/**
 * 请求追踪中间件：为每个请求生成唯一 ID
 */
export const requestTracker = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  const requestId = (req.headers['x-request-id'] as string) || generateRequestId();
  req.requestId = requestId;
  res.setHeader('X-Request-Id', requestId);

  const startTime = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - startTime;
    const logData = {
      requestId,
      method: req.method,
      url: req.originalUrl,
      statusCode: res.statusCode,
      duration: `${duration}ms`,
      ip: req.clientIp,
      userAgent: req.headers['user-agent'],
    };
    if (res.statusCode >= 400) {
      logger.warn('Request completed with error', logData);
    } else {
      logger.info('Request completed', logData);
    }
  });

  next();
};

/**
 * 客户端 IP 获取中间件
 */
export const clientIpMiddleware = (
  req: Request,
  _res: Response,
  next: NextFunction,
): void => {
  req.clientIp =
    (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() ||
    (req.headers['x-real-ip'] as string) ||
    req.socket.remoteAddress ||
    'unknown';
  next();
};

/**
 * 角色验证中间件（扩展用）
 */
export const requireRoles = (..._allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ success: false, message: '未登录', timestamp: new Date().toISOString() });
      return;
    }
    next();
  };
};

/**
 * 刷新令牌中间件
 */
export const validateRefreshToken = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { refreshToken } = req.body as { refreshToken?: string };

    if (!refreshToken) {
      res.status(400).json({ success: false, message: '未提供刷新令牌', timestamp: new Date().toISOString() });
      return;
    }

    (req as unknown as Record<string, unknown>).refreshToken = refreshToken;
    next();
  } catch (error) {
    logger.error('Refresh token validation error:', error);
    res.status(500).json({ success: false, message: '刷新令牌验证失败', timestamp: new Date().toISOString() });
  }
};
