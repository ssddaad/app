/**
 * 身份验证工具函数单元测试
 */

import {
  hashPassword,
  comparePassword,
  generateToken,
  verifyToken,
  generateVerificationCode,
  generateRandomToken,
  secureCompare,
  validatePasswordStrength,
  isValidPhoneNumber,
  maskPhoneNumber,
} from '../../src/utils/auth.utils';

describe('Auth Utils', () => {
  describe('hashPassword', () => {
    it('should hash a password successfully', async () => {
      const password = 'TestPassword123!';
      const hash = await hashPassword(password);
      
      expect(hash).toBeDefined();
      expect(hash).not.toBe(password);
      expect(hash.length).toBeGreaterThan(0);
    });

    it('should generate different hashes for same password', async () => {
      const password = 'TestPassword123!';
      const hash1 = await hashPassword(password);
      const hash2 = await hashPassword(password);
      
      expect(hash1).not.toBe(hash2); // bcrypt 自动添加盐值
    });
  });

  describe('comparePassword', () => {
    it('should return true for matching password', async () => {
      const password = 'TestPassword123!';
      const hash = await hashPassword(password);
      const result = await comparePassword(password, hash);
      
      expect(result).toBe(true);
    });

    it('should return false for non-matching password', async () => {
      const password = 'TestPassword123!';
      const wrongPassword = 'WrongPassword123!';
      const hash = await hashPassword(password);
      const result = await comparePassword(wrongPassword, hash);
      
      expect(result).toBe(false);
    });

    it('should return false for invalid hash', async () => {
      const password = 'TestPassword123!';
      const result = await comparePassword(password, 'invalid-hash');
      
      expect(result).toBe(false);
    });
  });

  describe('generateToken and verifyToken', () => {
    it('should generate and verify a valid token', () => {
      const payload = {
        id: 'test-id',
        phone: '13800138000',
        nickname: 'testuser',
      };
      
      const token = generateToken(payload);
      expect(token).toBeDefined();
      expect(typeof token).toBe('string');
      
      const decoded = verifyToken(token);
      expect(decoded).toBeDefined();
      expect(decoded?.id).toBe(payload.id);
      expect(decoded?.phone).toBe(payload.phone);
      expect(decoded?.nickname).toBe(payload.nickname);
    });

    it('should return null for invalid token', () => {
      const decoded = verifyToken('invalid-token');
      expect(decoded).toBeNull();
    });

    it('should return null for expired token', () => {
      // 创建一个已过期的令牌（使用过去的过期时间）
      const jwt = require('jsonwebtoken');
      const expiredToken = jwt.sign(
        { id: 'test', phone: '13800138000', nickname: 'test' },
        'test-secret',
        { expiresIn: '-1s' }
      );
      
      const decoded = verifyToken(expiredToken);
      expect(decoded).toBeNull();
    });
  });

  describe('generateVerificationCode', () => {
    it('should generate 6-digit code by default', () => {
      const code = generateVerificationCode();
      
      expect(code).toBeDefined();
      expect(code.length).toBe(6);
      expect(/^\d{6}$/.test(code)).toBe(true);
    });

    it('should generate code with specified length', () => {
      const code4 = generateVerificationCode(4);
      const code8 = generateVerificationCode(8);
      
      expect(code4.length).toBe(4);
      expect(code8.length).toBe(8);
    });

    it('should generate different codes', () => {
      const code1 = generateVerificationCode();
      const code2 = generateVerificationCode();
      
      expect(code1).not.toBe(code2);
    });
  });

  describe('generateRandomToken', () => {
    it('should generate a random token', () => {
      const token = generateRandomToken();
      
      expect(token).toBeDefined();
      expect(typeof token).toBe('string');
      expect(token.length).toBe(32); // UUID without dashes
    });

    it('should generate unique tokens', () => {
      const token1 = generateRandomToken();
      const token2 = generateRandomToken();
      
      expect(token1).not.toBe(token2);
    });
  });

  describe('secureCompare', () => {
    it('should return true for equal strings', () => {
      const result = secureCompare('test', 'test');
      expect(result).toBe(true);
    });

    it('should return false for different strings', () => {
      const result = secureCompare('test', 'different');
      expect(result).toBe(false);
    });

    it('should return false for different length strings', () => {
      const result = secureCompare('test', 'test1');
      expect(result).toBe(false);
    });
  });

  describe('validatePasswordStrength', () => {
    it('should validate strong password', () => {
      const result = validatePasswordStrength('StrongPass123!');
      
      expect(result.valid).toBe(true);
      expect(result.message).toBe('密码强度符合要求');
    });

    it('should reject short password', () => {
      const result = validatePasswordStrength('Short1!');
      
      expect(result.valid).toBe(false);
      expect(result.message).toContain('8 个字符');
    });

    it('should reject password without uppercase', () => {
      const result = validatePasswordStrength('lowercase123!');
      
      expect(result.valid).toBe(false);
      expect(result.message).toContain('大写字母');
    });

    it('should reject password without lowercase', () => {
      const result = validatePasswordStrength('UPPERCASE123!');
      
      expect(result.valid).toBe(false);
      expect(result.message).toContain('小写字母');
    });

    it('should reject password without number', () => {
      const result = validatePasswordStrength('NoNumberPass!');
      
      expect(result.valid).toBe(false);
      expect(result.message).toContain('数字');
    });

    it('should reject password without special character', () => {
      const result = validatePasswordStrength('NoSpecial123');
      
      expect(result.valid).toBe(false);
      expect(result.message).toContain('特殊字符');
    });
  });

  describe('isValidPhoneNumber', () => {
    it('should validate correct Chinese mobile number', () => {
      expect(isValidPhoneNumber('13800138000')).toBe(true);
      expect(isValidPhoneNumber('15912345678')).toBe(true);
      expect(isValidPhoneNumber('18612345678')).toBe(true);
    });

    it('should reject invalid phone numbers', () => {
      expect(isValidPhoneNumber('1380013800')).toBe(false); // 10 digits
      expect(isValidPhoneNumber('138001380000')).toBe(false); // 12 digits
      expect(isValidPhoneNumber('23800138000')).toBe(false); // starts with 2
      expect(isValidPhoneNumber('1380013800a')).toBe(false); // contains letter
      expect(isValidPhoneNumber('')).toBe(false);
    });
  });

  describe('maskPhoneNumber', () => {
    it('should mask phone number correctly', () => {
      const masked = maskPhoneNumber('13800138000');
      expect(masked).toBe('138****8000');
    });

    it('should return original for short number', () => {
      const short = '12345';
      expect(maskPhoneNumber(short)).toBe(short);
    });

    it('should handle empty string', () => {
      expect(maskPhoneNumber('')).toBe('');
    });
  });
});
