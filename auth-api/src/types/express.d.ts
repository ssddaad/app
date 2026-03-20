/**
 * Express 类型扩展
 * 
 * 扩展 Express 的 Request 类型，添加用户对象
 * 使 TypeScript 能够识别 req.user 属性
 */

import User from '../models/user.model';

declare global {
  namespace Express {
    /**
     * 扩展 Request 接口
     * 
     * 添加 user 属性用于存储已认证的用户信息
     */
    interface Request {
      /**
       * 已认证的用户对象
       * 由身份验证中间件设置
       */
      user?: User;
      
      /**
       * 请求唯一标识符
       * 用于日志追踪
       */
      requestId?: string;
      
      /**
       * 客户端 IP 地址
       */
      clientIp?: string;
    }
    
    /**
     * 扩展 Response 接口
     * 
     * 添加自定义响应方法
     */
    interface Response {
      /**
       * 发送成功响应
       * @param data - 响应数据
       * @param message - 成功消息
       */
      success: (data?: any, message?: string) => Response;
      
      /**
       * 发送错误响应
       * @param message - 错误消息
       * @param statusCode - HTTP 状态码
       * @param errors - 详细错误信息
       */
      error: (message: string, statusCode?: number, errors?: any[]) => Response;
    }
  }
}

/**
 * JWT Payload 接口
 */
export interface JWTPayload {
  /** 用户 ID */
  id: string;
  /** 手机号 */
  phone: string;
  /** 昵称 */
  nickname: string;
  /** 令牌签发时间 */
  iat?: number;
  /** 令牌过期时间 */
  exp?: number;
}

/**
 * 认证请求体接口
 */
export interface RegisterRequestBody {
  phone: string;
  password: string;
  nickname: string;
}

export interface LoginRequestBody {
  /** 用户名（可选） */
  username?: string;
  /** 密码（可选） */
  password?: string;
  /** 手机号（可选） */
  phone?: string;
  /** 验证码（可选） */
  code?: string;
}

export interface SendCodeRequestBody {
  phone: string;
  scene: 'login' | 'register' | 'reset_password';
}

/**
 * API 响应接口
 */
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  errors?: any[];
  timestamp: string;
  requestId?: string;
}

/**
 * 分页响应接口
 */
export interface PaginatedResponse<T = any> extends ApiResponse {
  data: {
    items: T[];
    pagination: {
      page: number;
      pageSize: number;
      total: number;
      totalPages: number;
    };
  };
}

export {};
