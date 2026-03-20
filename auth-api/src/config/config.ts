/**
 * 应用程序配置文件
 *
 * 该文件集中管理所有环境变量和配置项，提供类型安全和默认值。
 * 所有敏感信息应从环境变量读取，切勿硬编码到代码中。
 */

import dotenv from 'dotenv';

// 加载环境变量
dotenv.config();

// ─── 接口定义 ────────────────────────────────────────────────────────────────

interface ServerConfig {
  port: number;
  nodeEnv: string;
}

interface DatabaseConfig {
  url: string;
  host: string;
  port: number;
  name: string;
  user: string;
  password: string;
}

interface JWTConfig {
  secret: string;
  expiration: string;
  refreshSecret: string;
  refreshExpiration: string;
}

interface BcryptConfig {
  saltRounds: number;
}

interface RedisConfig {
  host: string;
  port: number;
  password?: string;
}

interface TwilioConfig {
  accountSid: string;
  authToken: string;
  phoneNumber: string;
}

interface RateLimitConfig {
  windowMs: number;
  maxRequests: number;
}

interface CorsConfig {
  origin: string;
}

interface Config {
  server: ServerConfig;
  database: DatabaseConfig;
  jwt: JWTConfig;
  bcrypt: BcryptConfig;
  redis: RedisConfig;
  twilio: TwilioConfig;
  rateLimit: RateLimitConfig;
  cors: CorsConfig;
}

// ─── 辅助函数 ─────────────────────────────────────────────────────────────────

/**
 * 读取必须存在的环境变量，生产环境缺失时直接抛出错误
 */
function requireEnv(key: string, fallback?: string): string {
  const value = process.env[key] ?? fallback;
  if (value === undefined || value === '') {
    // 在生产环境中，如果没有 fallback，启动时即崩溃
    if ((process.env.NODE_ENV ?? 'development') === 'production') {
      throw new Error(`[Config] Missing required environment variable: ${key}`);
    }
    // 开发环境返回空字符串，允许宽松启动
    return '';
  }
  return value;
}

function envInt(key: string, fallback: number): number {
  const raw = process.env[key];
  if (raw === undefined || raw === '') return fallback;
  const n = parseInt(raw, 10);
  return Number.isFinite(n) ? n : fallback;
}

// ─── 配置对象 ─────────────────────────────────────────────────────────────────

const isProd = (process.env.NODE_ENV ?? 'development') === 'production';

/**
 * 应用配置
 *
 * - 生产环境：JWT_SECRET、JWT_REFRESH_SECRET、DATABASE_URL、REDIS_HOST 均为必填，
 *   缺失时服务器将在启动时立刻抛出错误，而非以不安全的默认值运行。
 * - 开发环境：允许使用默认值快速启动。
 */
const config: Config = {
  server: {
    port: envInt('PORT', 3000),
    nodeEnv: process.env.NODE_ENV ?? 'development',
  },

  database: {
    url:
      process.env.DATABASE_URL ??
      'postgresql://user:password@localhost:5432/auth_database',
    host: process.env.DB_HOST ?? 'localhost',
    port: envInt('DB_PORT', 5432),
    name: process.env.DB_NAME ?? 'auth_database',
    user: process.env.DB_USER ?? 'user',
    password: process.env.DB_PASSWORD ?? 'password',
  },

  jwt: {
    // 生产环境必须通过环境变量注入真实密钥
    secret: isProd
      ? requireEnv('JWT_SECRET')
      : (process.env.JWT_SECRET ?? 'dev-jwt-secret-not-for-production'),
    expiration: process.env.JWT_EXPIRATION ?? '1h',
    refreshSecret: isProd
      ? requireEnv('JWT_REFRESH_SECRET')
      : (process.env.JWT_REFRESH_SECRET ?? 'dev-refresh-secret-not-for-production'),
    refreshExpiration: process.env.JWT_REFRESH_EXPIRATION ?? '7d',
  },

  bcrypt: {
    // 生产环境最低 12 轮，防止暴力破解
    saltRounds: Math.max(envInt('BCRYPT_SALT_ROUNDS', 12), isProd ? 12 : 10),
  },

  redis: {
    host: isProd
      ? requireEnv('REDIS_HOST')
      : (process.env.REDIS_HOST ?? 'localhost'),
    port: envInt('REDIS_PORT', 6379),
    password: process.env.REDIS_PASSWORD || undefined,
  },

  twilio: {
    accountSid: process.env.TWILIO_ACCOUNT_SID ?? '',
    authToken: process.env.TWILIO_AUTH_TOKEN ?? '',
    phoneNumber: process.env.TWILIO_PHONE_NUMBER ?? '',
  },

  rateLimit: {
    windowMs: envInt('RATE_LIMIT_WINDOW_MS', 900_000), // 15 分钟
    maxRequests: envInt('RATE_LIMIT_MAX_REQUESTS', 100),
  },

  cors: {
    origin: process.env.CORS_ORIGIN ?? (isProd ? '' : 'http://localhost:5173'),
  },
};

// ─── 配置验证 ─────────────────────────────────────────────────────────────────

/**
 * 验证必要的环境变量
 *
 * 在应用启动阶段调用，确保生产环境所有关键配置均已正确设置。
 * 包括安全性校验：密钥长度、CORS 配置等。
 */
export const validateConfig = (): void => {
  const env = config.server.nodeEnv;

  if (env === 'production') {
    // ── 必填项检查 ──────────────────────────────────────────────
    const required: string[] = [
      'JWT_SECRET',
      'JWT_REFRESH_SECRET',
      'DATABASE_URL',
      'REDIS_HOST',
      'CORS_ORIGIN',
    ];
    const missing = required.filter((k) => !process.env[k]);
    if (missing.length > 0) {
      throw new Error(
        `[Config] Missing required environment variables: ${missing.join(', ')}`,
      );
    }

    // ── 密钥强度检查 ────────────────────────────────────────────
    const jwtSecret = process.env.JWT_SECRET!;
    const jwtRefreshSecret = process.env.JWT_REFRESH_SECRET!;

    if (jwtSecret.length < 32) {
      throw new Error('[Config] JWT_SECRET must be at least 32 characters in production');
    }
    if (jwtRefreshSecret.length < 32) {
      throw new Error('[Config] JWT_REFRESH_SECRET must be at least 32 characters in production');
    }

    // ── 不允许在生产环境使用默认开发密钥 ───────────────────────
    const insecureDefaults = [
      'your-super-secret-jwt-key-change-this-in-production',
      'your-refresh-secret-key',
      'dev-jwt-secret-not-for-production',
      'dev-refresh-secret-not-for-production',
    ];
    if (insecureDefaults.includes(jwtSecret) || insecureDefaults.includes(jwtRefreshSecret)) {
      throw new Error('[Config] Insecure default JWT secret detected in production environment');
    }

    // ── 数据库密码检查 ──────────────────────────────────────────
    if (!process.env.DB_PASSWORD || process.env.DB_PASSWORD === 'password') {
      throw new Error('[Config] DB_PASSWORD must be set to a secure value in production');
    }

    // ── CORS 检查 ───────────────────────────────────────────────
    const corsOrigin = process.env.CORS_ORIGIN!;
    if (!corsOrigin || corsOrigin.trim() === '') {
      throw new Error('[Config] CORS_ORIGIN must not be empty in production');
    }
    if (corsOrigin === '*') {
      throw new Error('[Config] CORS_ORIGIN must not be wildcard (*) in production');
    }
  }
};

export default config;
