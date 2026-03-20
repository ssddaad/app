/**
 * 控制器统一导出
 * 
 * 集中导出所有控制器，方便其他模块导入
 */

export {
  register,
  login,
  sendCode,
  getUser,
  refreshToken,
  logout,
  changePassword,
  updateUser,
} from './auth.controller';
