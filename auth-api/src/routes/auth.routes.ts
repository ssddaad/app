/**
 * 身份验证路由
 * 
 * 定义所有与身份验证相关的 API 端点
 * 包括注册、登录、验证码、用户信息等
 */

import { Router } from 'express';
import { body } from 'express-validator';
import {
  register,
  login,
  sendCode,
  getUser,
  refreshToken,
  logout,
  changePassword,
  updateUser,
  resetPassword,
} from '../controllers/auth.controller';
import { authenticate } from '../middleware/auth.middleware';
import { validationErrorHandler } from '../middleware/error.middleware';

const router = Router();

/**
 * @route   POST /api/auth/register
 * @desc    用户注册
 * @access  Public
 * 
 * 请求体：
 * {
 *   "phone": "13800138000",
 *   "password": "Password123!",
 *   "nickname": "用户名"
 * }
 */
router.post(
  '/register',
  [
    body('phone')
      .isMobilePhone('zh-CN')
      .withMessage('请输入有效的中国大陆手机号'),
    body('password')
      .isLength({ min: 8 })
      .withMessage('密码长度至少为 8 个字符')
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
      .withMessage('密码必须包含大小写字母、数字和特殊字符'),
    body('nickname')
      .trim()
      .isLength({ min: 2, max: 50 })
      .withMessage('昵称长度必须在 2-50 个字符之间')
      .matches(/^[\u4e00-\u9fa5a-zA-Z0-9_]+$/)
      .withMessage('昵称只能包含中文、字母、数字和下划线'),
  ],
  validationErrorHandler,
  register
);

/**
 * @route   POST /api/auth/login
 * @desc    用户登录
 * @access  Public
 * 
 * 支持两种方式：
 * 1. 用户名/密码登录
 * {
 *   "username": "用户名",
 *   "password": "Password123!"
 * }
 * 
 * 2. 手机号/验证码登录
 * {
 *   "phone": "13800138000",
 *   "code": "123456"
 * }
 */
router.post(
  '/login',
  [
    body('username')
      .optional()
      .trim()
      .isLength({ min: 2, max: 50 })
      .withMessage('用户名长度必须在 2-50 个字符之间'),
    body('password')
      .optional()
      .isLength({ min: 6 })
      .withMessage('密码长度至少为 6 个字符'),
    body('phone')
      .optional()
      .isMobilePhone('zh-CN')
      .withMessage('请输入有效的中国大陆手机号'),
    body('code')
      .optional()
      .isLength({ min: 6, max: 6 })
      .isNumeric()
      .withMessage('验证码必须是 6 位数字'),
  ],
  validationErrorHandler,
  login
);

/**
 * @route   POST /api/auth/send-code
 * @desc    发送验证码
 * @access  Public
 * 
 * 请求体：
 * {
 *   "phone": "13800138000",
 *   "scene": "login" | "register" | "reset_password"
 * }
 */
router.post(
  '/send-code',
  [
    body('phone')
      .isMobilePhone('zh-CN')
      .withMessage('请输入有效的中国大陆手机号'),
    body('scene')
      .isIn(['login', 'register', 'reset_password'])
      .withMessage('场景必须是 login、register 或 reset_password'),
  ],
  validationErrorHandler,
  sendCode
);

/**
 * @route   POST /api/auth/refresh
 * @desc    刷新访问令牌
 * @access  Public
 * 
 * 请求体：
 * {
 *   "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
 * }
 */
router.post(
  '/refresh',
  [
    body('refreshToken')
      .notEmpty()
      .withMessage('刷新令牌不能为空'),
  ],
  validationErrorHandler,
  refreshToken
);

/**
 * @route   POST /api/auth/logout
 * @desc    用户登出
 * @access  Private
 */
router.post(
  '/logout',
  authenticate,
  logout
);

/**
 * @route   GET /api/auth/user
 * @desc    获取当前用户信息
 * @access  Private
 */
router.get(
  '/user',
  authenticate,
  getUser
);

/**
 * @route   PUT /api/auth/user
 * @desc    更新用户信息
 * @access  Private
 * 
 * 请求体：
 * {
 *   "nickname": "新昵称",
 *   "avatar_url": "https://example.com/avatar.jpg"
 * }
 */
router.put(
  '/user',
  authenticate,
  [
    body('nickname')
      .optional()
      .trim()
      .isLength({ min: 2, max: 50 })
      .withMessage('昵称长度必须在 2-50 个字符之间')
      .matches(/^[\u4e00-\u9fa5a-zA-Z0-9_]+$/)
      .withMessage('昵称只能包含中文、字母、数字和下划线'),
    body('avatar_url')
      .optional()
      .isURL()
      .withMessage('头像 URL 格式不正确'),
  ],
  validationErrorHandler,
  updateUser
);

/**
 * @route   POST /api/auth/change-password
 * @desc    修改密码
 * @access  Private
 * 
 * 请求体：
 * {
 *   "oldPassword": "旧密码",
 *   "newPassword": "新密码"
 * }
 */
router.post(
  '/change-password',
  authenticate,
  [
    body('oldPassword')
      .notEmpty()
      .withMessage('原密码不能为空'),
    body('newPassword')
      .isLength({ min: 8 })
      .withMessage('新密码长度至少为 8 个字符')
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
      .withMessage('新密码必须包含大小写字母、数字和特殊字符'),
  ],
  validationErrorHandler,
  changePassword
);

/**
 * @route   POST /api/auth/reset-password
 * @desc    重置密码（忘记密码）
 * @access  Public
 * 
 * 请求体：
 * {
 *   "phone": "13800138000",
 *   "code": "123456",
 *   "newPassword": "NewPassword123!"
 * }
 */
router.post(
  '/reset-password',
  [
    body('phone')
      .isMobilePhone('zh-CN')
      .withMessage('请输入有效的中国大陆手机号'),
    body('code')
      .isLength({ min: 6, max: 6 })
      .isNumeric()
      .withMessage('验证码必须是 6 位数字'),
    body('newPassword')
      .isLength({ min: 8 })
      .withMessage('新密码长度至少为 8 个字符')
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
      .withMessage('新密码必须包含大小写字母、数字和特殊字符'),
  ],
  validationErrorHandler,
  resetPassword
);

export default router;
