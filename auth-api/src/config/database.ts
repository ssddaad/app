/**
 * 数据库配置模块
 *
 * 配置 Sequelize 连接池和数据库实例，支持 PostgreSQL。
 * 提供连接测试功能；生产环境强制禁用自动同步，必须使用迁移脚本。
 */

import { Sequelize } from 'sequelize';
import config from './config';
import logger from '../utils/logger';

const isProd = config.server.nodeEnv === 'production';

/**
 * Sequelize 实例
 *
 * 连接池规格（生产 vs 开发）：
 *  - 生产：max=20 / min=5，适合中等并发
 *  - 开发：max=5  / min=1，节省本地资源
 */
export const sequelize = new Sequelize(
  config.database.name,
  config.database.user,
  config.database.password,
  {
    host: config.database.host,
    port: config.database.port,
    dialect: 'postgres',

    // 生产环境关闭 SQL 日志，避免敏感数据泄漏到日志文件
    logging: isProd ? false : (sql: string) => logger.debug(sql),

    pool: {
      max: isProd ? 20 : 5,
      min: isProd ? 5 : 1,
      acquire: 60_000, // 等待连接最长 60 秒
      idle: 10_000,    // 空闲连接保留 10 秒后释放
      evict: 30_000,   // 每 30 秒检查并驱逐超时空闲连接
    },

    retry: {
      max: 3,
    },

    // 使用东八区时间戳
    timezone: '+08:00',

    define: {
      timestamps: true,
      underscored: true,
      freezeTableName: false,
    },

    // 生产环境开启 SSL（如数据库要求）
    ...(isProd && process.env.DB_SSL === 'true'
      ? {
          dialectOptions: {
            ssl: {
              require: true,
              rejectUnauthorized: process.env.DB_SSL_REJECT_UNAUTHORIZED !== 'false',
            },
          },
        }
      : {}),
  },
);

/**
 * 测试数据库连接
 */
export const testConnection = async (): Promise<void> => {
  try {
    await sequelize.authenticate();
    logger.info('Database connection established successfully.');
  } catch (error) {
    logger.error('Unable to connect to the database:', error);
    throw error;
  }
};

/**
 * 同步数据库模型
 *
 * ⚠️  生产环境此函数为禁用操作，必须通过迁移脚本管理表结构。
 *    如确需强制同步，须同时设置 DB_SYNC_FORCE=true 且 NODE_ENV≠production。
 *
 * @param force - 是否强制重建表（会清空数据，仅限开发/测试）
 */
export const syncDatabase = async (force = false): Promise<void> => {
  if (isProd) {
    logger.warn(
      'syncDatabase() called in production — skipped. Use migration scripts instead.',
    );
    return;
  }

  try {
    await sequelize.sync({ force });
    logger.info(`Database synchronized${force ? ' (force mode)' : ''}.`);
  } catch (error) {
    logger.error('Error synchronizing database:', error);
    throw error;
  }
};

/**
 * 关闭数据库连接
 */
export const closeConnection = async (): Promise<void> => {
  try {
    await sequelize.close();
    logger.info('Database connection closed.');
  } catch (error) {
    logger.error('Error closing database connection:', error);
    throw error;
  }
};

export default sequelize;
