/**
 * @deprecated 此文件已废弃，请统一使用 src/services/api.ts
 * 保留此文件仅为向后兼容，未来版本将移除。
 */
export * from './services/api';

/** 清除本地 token（向后兼容） */
export function clearTokens(): void {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
}

import * as _api from './services/api';

const authService = {
  ..._api,
  clearTokens,
};

export default authService;
