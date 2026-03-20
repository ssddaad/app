/**
 * Express 应用入口
 *
 * 配置 Express 应用，加载中间件和路由
 */

import express, { Application, Request, Response, NextFunction } from 'express';
import compression from 'compression';
import cors from 'cors';
import helmet from 'helmet';
import hpp from 'hpp';
import rateLimit from 'express-rate-limit';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import path from 'path';

import config from './config/config';
import authRoutes from './routes/auth.routes';
import {
  errorHandler,
  notFoundHandler,
  setupUncaughtExceptionHandler,
} from './middleware/error.middleware';
import {
  requestTracker,
  clientIpMiddleware,
} from './middleware/auth.middleware';
import logger from './utils/logger';

const app: Application = express();
const isProd = config.server.nodeEnv === 'production';

// ─── 未捕获异常处理 ───────────────────────────────────────────────────────────
setupUncaughtExceptionHandler();

// ─── Gzip 压缩（所有响应体，减小传输体积） ────────────────────────────────────
// 仅压缩大于 1KB 的响应，避免小响应的压缩开销
app.use(
  compression({
    threshold: 1024,
    level: 6, // 压缩级别 1-9，6 为速度与压缩率的最佳平衡
    filter: (req, res) => {
      // 不压缩 Server-Sent Events / EventStream
      if (req.headers.accept === 'text/event-stream') return false;
      return compression.filter(req, res);
    },
  }),
);

// ─── 信任代理 ─────────────────────────────────────────────────────────────────
// 生产环境部署在 Nginx / 负载均衡后时，信任第一层代理
// 确保 req.ip 和 express-rate-limit 能读到真实客户端 IP
if (isProd) {
  app.set('trust proxy', 1);
}

// ─── 请求日志 ─────────────────────────────────────────────────────────────────
app.use((req: Request, _res: Response, next: NextFunction) => {
  if (isProd) {
    // 生产：只记录方法和路径，避免 Authorization / Cookie 等敏感头泄漏到日志
    logger.info(`[Request] ${req.method} ${req.path}`);
  } else {
    logger.debug(
      `[Request] ${req.method} ${req.path} - IP: ${req.ip ?? req.socket.remoteAddress}`,
    );
  }
  next();
});

// ─── Helmet 安全头 ────────────────────────────────────────────────────────────
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc:   ["'self'", "'unsafe-inline'"],
        scriptSrc:  ["'self'"],
        imgSrc:     ["'self'", 'data:', 'https:'],
      },
    },
    crossOriginEmbedderPolicy: false,
    // 生产环境强制 HSTS，告知浏览器只允许 HTTPS
    hsts: isProd
      ? { maxAge: 31_536_000, includeSubDomains: true, preload: true }
      : false,
  }),
);

// ─── CORS ─────────────────────────────────────────────────────────────────────
const corsOriginEnv = config.cors.origin;
logger.info(`[CORS] Configured origin: ${corsOriginEnv}`);

/**
 * 生产：严格白名单，CORS_ORIGIN 支持逗号分隔多个域名
 * 开发：允许常用本地端口，方便联调
 */
const allowedOrigins: string[] = isProd
  ? corsOriginEnv.split(',').map((o) => o.trim()).filter(Boolean)
  : [
      corsOriginEnv,
      'http://localhost:5173',
      'http://localhost:3000',
      'http://localhost:8080',
      'http://127.0.0.1:5173',
    ];

app.use(
  cors({
    origin: (origin, callback) => {
      // 允许无 origin 的请求（如 Postman、健康检查）
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        logger.warn(`[CORS] Blocked origin: ${origin}`);
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'X-Request-Id'],
    exposedHeaders: ['X-Request-Id'],
  }),
);

// ─── HPP：防止 HTTP 参数污染 ──────────────────────────────────────────────────
app.use(hpp());

// ─── 全局速率限制 ─────────────────────────────────────────────────────────────
const globalLimiter = rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.maxRequests,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: '请求过于频繁，请稍后再试',
    timestamp: new Date().toISOString(),
  },
  skip: (req) => req.path === '/health',
});
app.use(globalLimiter);

// 认证端点：更严格的速率限制（3 分钟内最多 10 次）
const authLimiter = rateLimit({
  windowMs: 3 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: '登录尝试次数过多，请 3 分钟后再试',
    timestamp: new Date().toISOString(),
  },
});

// ─── 请求体解析 ───────────────────────────────────────────────────────────────
app.use(express.json({ limit: '1mb' }));          // 生产环境限制 1 MB，开发时可适当放宽
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

// ─── 自定义中间件 ─────────────────────────────────────────────────────────────
app.use(clientIpMiddleware);  // 获取真实客户端 IP
app.use(requestTracker);      // 请求 ID 追踪

// ─── Swagger 文档（仅开发环境） ───────────────────────────────────────────────
if (!isProd) {
  try {
    const swaggerDocument = YAML.load(path.join(__dirname, '../docs/swagger.yaml'));
    app.use(
      '/api-docs',
      swaggerUi.serve,
      swaggerUi.setup(swaggerDocument, {
        explorer: true,
        customCss: '.swagger-ui .topbar { display: none }',
        customSiteTitle: 'Auth API 文档',
      }),
    );
    logger.info('Swagger UI available at /api-docs');
  } catch (error) {
    logger.warn('Swagger documentation not loaded:', error);
  }
}

// ─── 健康检查 ─────────────────────────────────────────────────────────────────
app.get('/health', (_req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: '服务正常运行',
    data: {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      environment: config.server.nodeEnv,
      version: process.env.npm_package_version ?? '1.0.0',
    },
  });
});

// 测试端点（仅开发环境暴露，避免信息泄漏）
if (!isProd) {
  app.get('/api/test', (req: Request, res: Response) => {
    logger.info('[Test] Test endpoint called');
    res.json({
      success: true,
      message: '后端连接成功',
      data: {
        timestamp: new Date().toISOString(),
        yourIp: req.ip,
      },
    });
  });
}

// ─── 路由 ─────────────────────────────────────────────────────────────────────
app.use('/api/auth', authLimiter, authRoutes);

app.get('/', (_req: Request, res: Response) => {
  res.json({
    success: true,
    message: 'Auth API 服务',
    data: {
      version: '1.0.0',
      health: '/health',
      ...(!isProd && { documentation: '/api-docs', test: '/api/test' }),
    },
  });
});

// ─── 错误处理（必须在所有路由之后） ──────────────────────────────────────────
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
