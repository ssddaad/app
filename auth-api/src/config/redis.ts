/**
 * Redis 配置模块
 *
 * 配置 Redis 客户端连接，用于：
 * - 存储验证码（短期过期）
 * - 存储用户会话信息
 * - 实现速率限制
 * - 缓存热点数据
 */

import { createClient, RedisClientType } from 'redis';
import config from './config';
import logger from '../utils/logger';

/** 单例 Redis 客户端 */
let redisClient: RedisClientType | null = null;

/**
 * 获取 Redis 客户端（懒加载单例）
 */
export const getRedisClient = (): RedisClientType => {
  if (!redisClient) {
    const clientConfig: Parameters<typeof createClient>[0] = {
      socket: {
        host: config.redis.host,
        port: config.redis.port,
        /**
         * 重连策略：指数退避，最多重试 10 次，上限 10 秒
         * 超出后返回 Error 实例，停止重连
         */
        reconnectStrategy: (retries: number) => {
          if (retries > 10) {
            logger.error('Redis: max reconnection attempts (10) reached, giving up.');
            return new Error('Redis max reconnection attempts reached');
          }
          const delay = Math.min(100 * 2 ** retries, 10_000);
          logger.warn(`Redis: reconnecting in ${delay}ms (attempt ${retries + 1}/10)`);
          return delay;
        },
        connectTimeout: 10_000, // 初始连接超时 10 秒
        keepAlive: 5_000,       // TCP keepalive 5 秒，防止防火墙断连
      },
    };

    // 有密码时才注入，避免传入空字符串导致认证失败
    if (config.redis.password) {
      clientConfig.password = config.redis.password;
    }

    redisClient = createClient(clientConfig) as RedisClientType;

    redisClient.on('error', (err: Error) => {
      logger.error('Redis client error:', { message: err.message });
    });

    redisClient.on('connect', () => {
      logger.info('Redis client connected.');
    });

    redisClient.on('reconnecting', () => {
      logger.warn('Redis client reconnecting...');
    });

    redisClient.on('ready', () => {
      logger.info('Redis client ready.');
    });

    redisClient.on('end', () => {
      logger.info('Redis client connection closed.');
    });
  }

  return redisClient;
};

/**
 * 连接 Redis
 */
export const connectRedis = async (): Promise<void> => {
  const client = getRedisClient();
  if (!client.isOpen) {
    await client.connect();
  }
};

/**
 * 断开 Redis 连接
 */
export const disconnectRedis = async (): Promise<void> => {
  if (redisClient && redisClient.isOpen) {
    await redisClient.quit();
    redisClient = null;
    logger.info('Redis connection closed.');
  }
};

// ─── Redis 键名生成器 ─────────────────────────────────────────────────────────

/**
 * 统一管理 Redis 键名，避免命名冲突
 */
export const redisKeys = {
  verificationCode: (phone: string, scene: string): string =>
    `code:${scene}:${phone}`,

  userSession: (userId: string): string =>
    `session:${userId}`,

  loginAttempts: (identifier: string): string =>
    `login:attempts:${identifier}`,

  rateLimit: (identifier: string, action: string): string =>
    `ratelimit:${action}:${identifier}`,

  refreshToken: (token: string): string =>
    `refresh:${token}`,

  /** 发送验证码频率限制 */
  sendCodeRateLimit: (phone: string): string =>
    `rate_limit:send_code:${phone}`,
};

// ─── TTL 常量（秒） ───────────────────────────────────────────────────────────

export const redisTTL = {
  VERIFICATION_CODE: 300,   // 验证码：5 分钟
  USER_SESSION: 86_400,     // 用户会话：24 小时
  LOGIN_ATTEMPTS: 1_800,    // 登录失败记录：30 分钟
  RATE_LIMIT: 900,          // 速率限制窗口：15 分钟
  REFRESH_TOKEN: 604_800,   // 刷新令牌：7 天
  SEND_CODE_COOLDOWN: 60,   // 发码冷却：60 秒
};

// 注意：请勿在此处调用 getRedisClient()，客户端须在 server.ts 中通过 connectRedis() 连接后使用
