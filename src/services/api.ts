/**
 * 认证 API 服务（与后端 auth-api 完全对齐）
 *
 * 后端路由：POST /api/auth/login
 *   - 用户名密码：{ username, password }
 *   - 手机验证码：{ phone, code }
 *
 * 后端路由：POST /api/auth/register
 *   - { phone, password, nickname }
 *
 * 后端路由：POST /api/auth/send-code
 *   - { phone, scene: 'login' | 'register' | 'reset_password' }
 *
 * 后端路由：POST /api/auth/reset-password
 *   - { phone, code, newPassword }
 */

import { httpClient } from '../lib/httpClient';

// ─── 类型定义（与后端响应对齐） ───────────────────────────────────────────────

export interface BackendUser {
  id: string;
  phone: string;
  nickname: string;
  avatar_url?: string;
  status: string;
  created_at: string;
  updated_at?: string;
}

export interface LoginPayload {
  username?: string;
  password?: string;
  phone?: string;
  code?: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  data: {
    user: BackendUser;
    tokens: {
      accessToken: string;
      refreshToken: string;
      expiresIn: number;
    };
  };
}

export interface RegisterPayload {
  phone: string;
  password: string;
  nickname: string;
}

export interface RegisterResponse {
  success: boolean;
  message: string;
  data: { user: BackendUser };
}

export interface SendCodePayload {
  phone: string;
  /** 注意：前端 'forgot' 必须映射为后端的 'reset_password' */
  scene: 'login' | 'register' | 'reset_password';
}

export interface ResetPasswordPayload {
  phone: string;
  code: string;
  newPassword: string;
}

// ─── API 函数 ─────────────────────────────────────────────────────────────────

/** 登录（用户名+密码 或 手机号+验证码） */
export async function login(payload: LoginPayload): Promise<LoginResponse['data']> {
  const response = await httpClient<LoginResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify(payload),
  }, true /* skipAuth */);
  if (response.data.tokens) {
    localStorage.setItem('accessToken', response.data.tokens.accessToken);
    localStorage.setItem('refreshToken', response.data.tokens.refreshToken);
  }
  return response.data;
}

/** 注册 */
export async function register(payload: RegisterPayload): Promise<RegisterResponse['data']> {
  const response = await httpClient<RegisterResponse>('/auth/register', {
    method: 'POST',
    body: JSON.stringify(payload),
  }, true /* skipAuth */);
  return response.data;
}

/**
 * 发送验证码
 * scene: 'login' | 'register' | 'reset_password'
 */
export async function sendCode(
  payload: SendCodePayload,
): Promise<{ expiresIn: number; code?: string }> {
  const response = await httpClient<{
    success: boolean;
    data: { expiresIn: number; code?: string };
  }>('/auth/send-code', {
    method: 'POST',
    body: JSON.stringify(payload),
  }, true /* skipAuth */);
  return response.data;
}

/** 重置密码 */
export async function resetPassword(payload: ResetPasswordPayload): Promise<void> {
  await httpClient('/auth/reset-password', {
    method: 'POST',
    body: JSON.stringify(payload),
  }, true /* skipAuth */);
}

/** 登出 */
export async function logout(): Promise<void> {
  try {
    await httpClient('/auth/logout', { method: 'POST' });
  } catch {
    // 登出失败不阻断前端清理
  }
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
}

/** 获取当前登录用户信息 */
export async function getCurrentUser(): Promise<BackendUser> {
  const response = await httpClient<{ success: boolean; data: { user: BackendUser } }>(
    '/auth/user',
  );
  return response.data.user;
}

/** 检查是否已登录 */
export function isAuthenticated(): boolean {
  return !!localStorage.getItem('accessToken');
}

export default {
  login,
  register,
  sendCode,
  resetPassword,
  logout,
  getCurrentUser,
  isAuthenticated,
};
