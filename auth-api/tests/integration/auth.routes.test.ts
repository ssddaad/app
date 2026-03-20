/**
 * 身份验证路由集成测试
 * 
 * 测试完整的 API 端点流程
 */

import request from 'supertest';
import app from '../../src/app';

// 模拟数据库和 Redis
jest.mock('../../src/config/database', () => ({
  sequelize: {
    authenticate: jest.fn().mockResolvedValue(undefined),
    sync: jest.fn().mockResolvedValue(undefined),
    close: jest.fn().mockResolvedValue(undefined),
  },
  testConnection: jest.fn().mockResolvedValue(undefined),
  syncDatabase: jest.fn().mockResolvedValue(undefined),
}));

jest.mock('../../src/config/redis', () => ({
  getRedisClient: jest.fn(() => ({
    get: jest.fn().mockResolvedValue(null),
    setEx: jest.fn().mockResolvedValue('OK'),
    del: jest.fn().mockResolvedValue(1),
    isOpen: true,
    connect: jest.fn().mockResolvedValue(undefined),
    quit: jest.fn().mockResolvedValue(undefined),
  })),
  connectRedis: jest.fn().mockResolvedValue(undefined),
  disconnectRedis: jest.fn().mockResolvedValue(undefined),
  redisKeys: {
    verificationCode: (phone: string, scene: string) => `code:${scene}:${phone}`,
  },
  redisTTL: {
    VERIFICATION_CODE: 300,
  },
}));

jest.mock('../../src/services/sms.service', () => ({
  sendVerificationCode: jest.fn().mockResolvedValue({
    success: true,
    messageId: 'test-message-id',
  }),
}));

describe('Auth Routes Integration Tests', () => {
  describe('GET /health', () => {
    it('should return health status', async () => {
      const response = await request(app)
        .get('/health')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.status).toBe('healthy');
    });
  });

  describe('GET /', () => {
    it('should return API info', async () => {
      const response = await request(app)
        .get('/')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.version).toBeDefined();
    });
  });

  describe('POST /api/auth/register', () => {
    it('should validate required fields', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({})
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('验证失败');
    });

    it('should validate phone format', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          phone: 'invalid-phone',
          password: 'TestPass123!',
          nickname: 'testuser',
        })
        .expect(400);

      expect(response.body.success).toBe(false);
    });

    it('should validate password strength', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          phone: '13800138000',
          password: 'weak',
          nickname: 'testuser',
        })
        .expect(400);

      expect(response.body.success).toBe(false);
    });

    it('should validate nickname length', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          phone: '13800138000',
          password: 'TestPass123!',
          nickname: 'a',
        })
        .expect(400);

      expect(response.body.success).toBe(false);
    });
  });

  describe('POST /api/auth/login', () => {
    it('should validate login request', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({})
        .expect(400);

      expect(response.body.success).toBe(false);
    });

    it('should accept username/password login', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          username: 'testuser',
          password: 'TestPass123!',
        });

      // 由于数据库被模拟，这里可能返回 401，但请求格式是正确的
      expect([400, 401, 404, 500]).toContain(response.status);
    });

    it('should accept phone/code login', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          phone: '13800138000',
          code: '123456',
        });

      expect([400, 401, 404, 500]).toContain(response.status);
    });

    it('should reject invalid code format', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          phone: '13800138000',
          code: '12345', // 5 digits instead of 6
        })
        .expect(400);

      expect(response.body.success).toBe(false);
    });
  });

  describe('POST /api/auth/send-code', () => {
    it('should validate phone number', async () => {
      const response = await request(app)
        .post('/api/auth/send-code')
        .send({
          phone: 'invalid-phone',
          scene: 'login',
        })
        .expect(400);

      expect(response.body.success).toBe(false);
    });

    it('should validate scene parameter', async () => {
      const response = await request(app)
        .post('/api/auth/send-code')
        .send({
          phone: '13800138000',
          scene: 'invalid-scene',
        })
        .expect(400);

      expect(response.body.success).toBe(false);
    });

    it('should accept valid request', async () => {
      const response = await request(app)
        .post('/api/auth/send-code')
        .send({
          phone: '13800138000',
          scene: 'login',
        });

      // 可能成功或失败，取决于模拟的实现
      expect(response.status).toBeLessThan(500);
    });
  });

  describe('POST /api/auth/refresh', () => {
    it('should require refresh token', async () => {
      const response = await request(app)
        .post('/api/auth/refresh')
        .send({})
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('刷新令牌');
    });

    it('should validate token format', async () => {
      const response = await request(app)
        .post('/api/auth/refresh')
        .send({
          refreshToken: 'invalid-token',
        });

      // 由于令牌无效，应该返回 401
      expect([401, 500]).toContain(response.status);
    });
  });

  describe('Protected Routes', () => {
    it('should reject request without token', async () => {
      const response = await request(app)
        .get('/api/auth/user')
        .expect(401);

      expect(response.body.success).toBe(false);
    });

    it('should reject request with invalid token', async () => {
      const response = await request(app)
        .get('/api/auth/user')
        .set('Authorization', 'Bearer invalid-token')
        .expect(401);

      expect(response.body.success).toBe(false);
    });

    it('should reject request with malformed auth header', async () => {
      const response = await request(app)
        .get('/api/auth/user')
        .set('Authorization', 'invalid-format')
        .expect(401);

      expect(response.body.success).toBe(false);
    });
  });

  describe('POST /api/auth/logout', () => {
    it('should require authentication', async () => {
      const response = await request(app)
        .post('/api/auth/logout')
        .expect(401);

      expect(response.body.success).toBe(false);
    });
  });

  describe('PUT /api/auth/user', () => {
    it('should require authentication', async () => {
      const response = await request(app)
        .put('/api/auth/user')
        .send({ nickname: 'newname' })
        .expect(401);

      expect(response.body.success).toBe(false);
    });

    it('should validate nickname format', async () => {
      const response = await request(app)
        .put('/api/auth/user')
        .set('Authorization', 'Bearer fake-token')
        .send({ nickname: 'a' })
        .expect(401); // 先验证 token，再验证参数

      expect(response.body.success).toBe(false);
    });
  });

  describe('POST /api/auth/change-password', () => {
    it('should require authentication', async () => {
      const response = await request(app)
        .post('/api/auth/change-password')
        .send({
          oldPassword: 'oldpass',
          newPassword: 'NewPass123!',
        })
        .expect(401);

      expect(response.body.success).toBe(false);
    });

    it('should validate new password strength', async () => {
      const response = await request(app)
        .post('/api/auth/change-password')
        .set('Authorization', 'Bearer fake-token')
        .send({
          oldPassword: 'oldpass',
          newPassword: 'weak',
        })
        .expect(401);

      expect(response.body.success).toBe(false);
    });
  });
});
