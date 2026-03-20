/**
 * Jest 测试设置文件
 * 
 * 在所有测试运行前执行，用于设置测试环境
 */

import dotenv from 'dotenv';

// 加载测试环境变量
dotenv.config({ path: '.env.test' });

// 设置测试环境
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-jwt-secret';
process.env.JWT_REFRESH_SECRET = 'test-refresh-secret';
process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/test_db';
process.env.REDIS_HOST = 'localhost';
process.env.REDIS_PORT = '6379';

// 模拟 console 方法以减少测试输出
// global.console = {
//   ...console,
//   log: jest.fn(),
//   debug: jest.fn(),
//   info: jest.fn(),
//   warn: jest.fn(),
//   error: jest.fn(),
// };

// 全局测试超时
jest.setTimeout(30000);

// 在所有测试结束后清理
afterAll(async () => {
  // 等待所有异步操作完成
  await new Promise(resolve => setTimeout(resolve, 500));
});
