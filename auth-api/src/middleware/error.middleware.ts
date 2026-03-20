/**
 * 错误处理中间件
 * 
 * 集中处理应用程序中的所有错误
 * 提供统一的错误响应格式和日志记录
 */

import { Request, Response, NextFunction } from 'express';
import { ValidationError, validationResult } from 'express-validator';
import logger from '../utils/logger';

/**
 * 自定义错误类
 * 
 * 扩展标准 Error 类，添加 HTTP 状态码和错误详情
 */
export class AppError extends Error {
  public statusCode: number;
  public errors?: ValidationError[];
  public isOperational: boolean;

  constructor(
    message: string,
    statusCode: number = 500,
    errors?: ValidationError[]
  ) {
    super(message);
    this.statusCode = statusCode;
    this.errors = errors;
    this.isOperational = true; // 标记为可预期的操作错误

    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * 404 错误处理中间件
 * 
 * 处理未找到的路由
 */
export const notFoundHandler = (
  req: Request,
  _res: Response,
  next: NextFunction
): void => {
  const error = new AppError(
    `Route ${req.originalUrl} not found`,
    404
  );
  next(error);
};

/**
 * 全局错误处理中间件
 * 
 * 捕获并处理所有未捕获的错误
 * 根据环境返回不同的错误详情
 */
export const errorHandler = (
  err: Error | AppError,
  req: Request,
  res: Response,
  _next: NextFunction
): void => {
  // 确定错误类型和状态码
  let statusCode = 500;
  let message = '服务器内部错误';
  let errors: any[] | undefined;

  if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
    errors = err.errors;
  } else if (err.name === 'SequelizeValidationError') {
    statusCode = 400;
    message = '数据验证错误';
    errors = (err as any).errors.map((e: any) => ({
      field: e.path,
      message: e.message,
    }));
  } else if (err.name === 'SequelizeUniqueConstraintError') {
    statusCode = 409;
    message = '数据已存在';
    errors = (err as any).errors.map((e: any) => ({
      field: e.path,
      message: e.message,
    }));
  } else if (err.name === 'SequelizeForeignKeyConstraintError') {
    statusCode = 400;
    message = '关联数据不存在';
  } else if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = '无效的认证令牌';
  } else if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = '认证令牌已过期';
  } else if (err.name === 'SyntaxError' && 'body' in err) {
    statusCode = 400;
    message = '请求体 JSON 格式错误';
  }

  // 记录错误日志
  const logData = {
    requestId: req.requestId,
    statusCode,
    message: err.message,
    stack: err.stack,
    url: req.originalUrl,
    method: req.method,
    ip: req.clientIp,
    userAgent: req.headers['user-agent'],
  };

  if (statusCode >= 500) {
    logger.error('Server error:', logData);
  } else {
    logger.warn('Client error:', logData);
  }

  // 构建错误响应
  const errorResponse: any = {
    success: false,
    message,
    timestamp: new Date().toISOString(),
    requestId: req.requestId,
  };

  // 开发环境添加错误详情
  if (process.env.NODE_ENV === 'development') {
    errorResponse.error = err.message;
    errorResponse.stack = err.stack?.split('\n');
  }

  // 添加验证错误详情
  if (errors) {
    errorResponse.errors = errors;
  }

  res.status(statusCode).json(errorResponse);
};

/**
 * 异步处理包装器
 * 
 * 包装异步路由处理函数，自动捕获 Promise 错误
 * 
 * @param fn - 异步处理函数
 * @returns 包装后的函数
 */
export const asyncHandler = (
  fn: (req: Request, res: Response, next: NextFunction) => Promise<any>
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

/**
 * 验证错误处理中间件
 * 
 * 处理 express-validator 的验证错误
 */
export const validationErrorHandler = (
  req: Request,
  _res: Response,
  next: NextFunction
): void => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    const error = new AppError(
      '请求参数验证失败',
      400,
      errors.array()
    );
    next(error);
    return;
  }
  
  next();
};

/**
 * 未捕获异常处理
 * 
 * 处理进程级别的未捕获异常
 */
export const setupUncaughtExceptionHandler = (): void => {
  process.on('uncaughtException', (err: Error) => {
    logger.error('Uncaught Exception:', err);
    
    // 给日志记录一些时间后退出进程
    setTimeout(() => {
      process.exit(1);
    }, 1000);
  });

  process.on('unhandledRejection', (reason: any, promise: Promise<any>) => {
    logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
  });
};

/**
 * 优雅关闭处理
 * 
 * 处理进程终止信号，确保资源正确释放
 * 
 * @param cleanup - 清理函数
 */
export const setupGracefulShutdown = (cleanup: () => Promise<void>): void => {
  const shutdown = async (signal: string) => {
    logger.info(`${signal} received. Starting graceful shutdown...`);
    
    try {
      await cleanup();
      logger.info('Cleanup completed. Exiting...');
      process.exit(0);
    } catch (error) {
      logger.error('Error during cleanup:', error);
      process.exit(1);
    }
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));
};
