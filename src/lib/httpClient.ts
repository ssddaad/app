/**
 * 统一 HTTP 客户端
 *
 * 功能：
 * - 自动附加 Authorization Bearer token
 * - access token 过期时自动用 refresh token 换新 token（仅重试一次）
 * - 统一错误格式
 */

const AUTH_API_BASE = import.meta.env.VITE_API_BASE_URL || '/api';

/** 是否正在刷新 token（防止并发多次刷新） */
let isRefreshing = false;
/** 等待 token 刷新的请求队列 */
let pendingQueue: Array<{ resolve: (token: string) => void; reject: (err: Error) => void }> = [];

function processQueue(newToken: string) {
  pendingQueue.forEach(({ resolve }) => resolve(newToken));
  pendingQueue = [];
}

function rejectQueue(err: Error) {
  pendingQueue.forEach(({ reject }) => reject(err));
  pendingQueue = [];
}

async function refreshAccessToken(): Promise<string> {
  const refreshToken = localStorage.getItem('refreshToken');
  if (!refreshToken) throw new Error('无刷新令牌，请重新登录');

  const res = await fetch(`${AUTH_API_BASE}/auth/refresh`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refreshToken }),
  });

  if (!res.ok) {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    throw new Error('Token 刷新失败，请重新登录');
  }

  const data = await res.json();
  const newAccessToken: string = data.data.tokens.accessToken;
  const newRefreshToken: string = data.data.tokens.refreshToken;

  localStorage.setItem('accessToken', newAccessToken);
  localStorage.setItem('refreshToken', newRefreshToken);

  return newAccessToken;
}

/**
 * 带认证的 fetch 封装
 *
 * @param endpoint  相对路径，如 '/auth/user'
 * @param options   RequestInit
 * @param skipAuth  是否跳过自动附加 token（登录/注册接口用）
 */
export async function httpClient<T = unknown>(
  endpoint: string,
  options: RequestInit = {},
  skipAuth = false,
): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (!skipAuth) {
    const token = localStorage.getItem('accessToken');
    if (token) headers['Authorization'] = `Bearer ${token}`;
  }

  const doFetch = (accessToken?: string) =>
    fetch(`${AUTH_API_BASE}${endpoint}`, {
      ...options,
      headers: accessToken
        ? { ...headers, Authorization: `Bearer ${accessToken}` }
        : headers,
    });

  let response = await doFetch();

  // access token 过期，尝试刷新
  if (response.status === 401 && !skipAuth) {
    if (isRefreshing) {
      // 已有刷新在进行，加入等待队列
      const newToken = await new Promise<string>((resolve, reject) => {
        pendingQueue.push({ resolve, reject });
      });
      response = await doFetch(newToken);
    } else {
      isRefreshing = true;
      try {
        const newToken = await refreshAccessToken();
        processQueue(newToken);
        response = await doFetch(newToken);
      } catch (err) {
        rejectQueue(err instanceof Error ? err : new Error(String(err)));
        throw err;
      } finally {
        isRefreshing = false;
      }
    }
  }

  const data = await response.json();

  if (!response.ok || data.success === false) {
    throw new Error(data.message || `请求失败 (${response.status})`);
  }

  return data as T;
}

export default httpClient;
