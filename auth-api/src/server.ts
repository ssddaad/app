/**
 * 服务器启动文件
 *
 * 负责初始化数据库连接、Redis 连接并启动 HTTP 服务器
 */

import app from './app';
import config from './config/config';
import { validateConfig } from './config/config';
import { sequelize, testConnection, syncDatabase } from './config/database';
import { connectRedis, disconnectRedis } from './config/redis';
import { setupGracefulShutdown } from './middleware/error.middleware';
import logger from './utils/logger';

const PORT = config.server.port;
const isProd = config.server.nodeEnv === 'production';

/** 启动超时（毫秒）：超时后强制退出，防止卡死 */
const STARTUP_TIMEOUT_MS = 30_000;

const startServer = async (): Promise<void> => {
  // 启动超时保护
  const startupTimer = setTimeout(() => {
    logger.error('Server startup timed out after 30 seconds. Exiting.');
    process.exit(1);
  }, STARTUP_TIMEOUT_MS);
  startupTimer.unref(); // 不阻止进程正常退出

  try {
    logger.info('========================================');
    logger.info('Starting Auth API Server...');
    logger.info(`Environment: ${config.server.nodeEnv}`);
    logger.info(`Node Version: ${process.version}`);
    logger.info('========================================');

    // 1. 验证配置（生产环境校验密钥强度、必填项）
    logger.info('Validating configuration...');
    validateConfig();
    logger.info('Configuration validated.');

    // 2. 连接数据库
    logger.info('Connecting to database...');
    await testConnection();
    logger.info('Database connected.');

    // 3. 连接 Redis
    logger.info('Connecting to Redis...');
    await connectRedis();
    logger.info('Redis connected.');

    // 4. 数据库模型同步
    //    - 生产环境：syncDatabase 内部会直接 return，不执行任何操作
    //    - 开发/测试环境：DB_SYNC_FORCE=true 时强制重建（会清空数据，谨慎使用）
    if (!isProd) {
      const syncForce = process.env.DB_SYNC_FORCE === 'true';
      logger.info(`Syncing database models${syncForce ? ' (force mode)' : ''}...`);
      await syncDatabase(syncForce);
      logger.info('Database models synced.');
    }

    // 5. 启动 HTTP 服务器
    const server = app.listen(PORT, () => {
      clearTimeout(startupTimer); // 启动成功，取消超时
      logger.info('========================================');
      logger.info(`Server is running on port ${PORT}`);
      if (!isProd) {
        logger.info(`API Documentation: http://localhost:${PORT}/api-docs`);
        logger.info(`Test endpoint:     http://localhost:${PORT}/api/test`);
      }
      logger.info(`Health Check:      http://localhost:${PORT}/health`);
      logger.info('========================================');
    });

    // 设置优雅关闭
    setupGracefulShutdown(async () => {
      logger.info('Shutting down server...');

      // 先停止接受新连接
      server.close(() => {
        logger.info('HTTP server closed.');
      });

      // 关闭数据库
      await sequelize.close();
      logger.info('Database connection closed.');

      // 关闭 Redis
      await disconnectRedis();
      logger.info('Redis connection closed.');
    });
  } catch (error) {
    clearTimeout(startupTimer);
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

// ─── 进程级兜底错误处理 ───────────────────────────────────────────────────────

process.on('unhandledRejection', (reason: unknown) => {
  logger.error('Unhandled Promise Rejection:', reason);
  setTimeout(() => process.exit(1), 1_000);
});

process.on('uncaughtException', (error: Error) => {
  logger.error('Uncaught Exception:', error);
  setTimeout(() => process.exit(1), 1_000);
});
