/**
 * 日志工具模块
 * 
 * 使用 Winston 库提供结构化日志记录功能
 * 支持多种日志级别、传输方式和格式化选项
 */

import winston from 'winston';
import path from 'path';
import config from '../config/config';

/**
 * 日志级别定义
 * 
 * 级别越高，日志越详细
 */
const LOG_LEVELS = {
  error: 0,   // 错误：需要立即处理的问题
  warn: 1,    // 警告：潜在问题
  info: 2,    // 信息：正常运行日志
  http: 3,    // HTTP：请求日志
  verbose: 4, // 详细：调试信息
  debug: 5,   // 调试：开发调试
  silly: 6,   // 所有信息
};

/**
 * 日志颜色配置
 * 
 * 为不同级别设置不同颜色，便于控制台查看
 */
const LOG_COLORS = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  http: 'magenta',
  verbose: 'cyan',
  debug: 'blue',
  silly: 'gray',
};

// 添加颜色支持
winston.addColors(LOG_COLORS);

/**
 * 日志格式配置
 * 
 * 开发环境：彩色控制台输出
 * 生产环境：JSON 格式，便于日志收集系统处理
 */
const consoleFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.colorize({ all: true }),
  winston.format.printf(({ level, message, timestamp, ...metadata }) => {
    let msg = `${timestamp} [${level}]: ${message}`;
    if (Object.keys(metadata).length > 0) {
      msg += ` ${JSON.stringify(metadata)}`;
    }
    return msg;
  })
);

const fileFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss.SSS' }),
  winston.format.errors({ stack: true }),
  winston.format.json()
);

/**
 * 创建 Winston 日志记录器
 */
const logger = winston.createLogger({
  level: config.server.nodeEnv === 'development' ? 'debug' : 'info',
  levels: LOG_LEVELS,
  defaultMeta: {
    service: 'auth-api',
    environment: config.server.nodeEnv,
  },
  exitOnError: false, // 日志错误不退出进程
});

/**
 * 配置传输方式
 */

// 控制台传输（所有环境）
logger.add(new winston.transports.Console({
  format: consoleFormat,
}));

// 文件传输（生产环境）
if (config.server.nodeEnv === 'production') {
  // 错误日志
  logger.add(new winston.transports.File({
    filename: path.join('logs', 'error.log'),
    level: 'error',
    format: fileFormat,
    maxsize: 10485760, // 10MB
    maxFiles: 5,
  }));
  
  // 组合日志
  logger.add(new winston.transports.File({
    filename: path.join('logs', 'combined.log'),
    format: fileFormat,
    maxsize: 10485760, // 10MB
    maxFiles: 10,
  }));
  
  // HTTP 请求日志
  logger.add(new winston.transports.File({
    filename: path.join('logs', 'http.log'),
    level: 'http',
    format: fileFormat,
    maxsize: 10485760, // 10MB
    maxFiles: 5,
  }));
}

/**
 * 日志流接口
 * 
 * 用于 Morgan HTTP 日志中间件
 */
export const logStream = {
  write: (message: string): void => {
    logger.http(message.trim());
  },
};

/**
 * 请求上下文日志
 * 
 * 为每个请求创建带 requestId 的日志记录器
 * 
 * @param requestId - 请求唯一标识符
 */
export const createRequestLogger = (requestId: string) => {
  return logger.child({ requestId });
};

/**
 * 性能日志
 * 
 * 记录操作执行时间
 * 
 * @param operation - 操作名称
 * @param durationMs - 执行时间（毫秒）
 * @param metadata - 附加元数据
 */
export const logPerformance = (
  operation: string,
  durationMs: number,
  metadata?: Record<string, any>
): void => {
  logger.info(`Performance: ${operation} took ${durationMs}ms`, {
    operation,
    durationMs,
    ...metadata,
  });
};

/**
 * 安全日志
 * 
 * 记录安全相关事件
 * 
 * @param event - 安全事件类型
 * @param details - 事件详情
 */
export const logSecurity = (
  event: string,
  details: Record<string, any>
): void => {
  logger.warn(`Security Event: ${event}`, {
    security: true,
    event,
    ...details,
  });
};

/**
 * 审计日志
 * 
 * 记录用户操作审计信息
 * 
 * @param action - 操作类型
 * @param userId - 用户 ID
 * @param details - 操作详情
 */
export const logAudit = (
  action: string,
  userId: string,
  details: Record<string, any>
): void => {
  logger.info(`Audit: ${action}`, {
    audit: true,
    action,
    userId,
    timestamp: new Date().toISOString(),
    ...details,
  });
};

export default logger;
