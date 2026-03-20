import React, { useState, useEffect } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { Input, Button, message } from 'antd';
import { SearchOutlined, UserOutlined, LogoutOutlined } from '@ant-design/icons';
import AuthModal from './AuthModal';
import lg2 from './logo2.png';
import { useUser } from './userContext';
import {
  isAuthenticated,
  getCurrentUser,
  login as apiLogin,
  register as apiRegister,
  sendCode as apiSendCode,
  resetPassword as apiResetPassword,
  logout as apiLogout,
} from '../services/api';

// 统一 auth 操作对象，含 clearTokens
const authService = {
  isAuthenticated,
  getCurrentUser,
  login: apiLogin,
  register: apiRegister,
  sendCode: apiSendCode,
  resetPassword: apiResetPassword,
  logout: apiLogout,
  clearTokens: () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  },
};

const AuthButton: React.FC = () => {
  const [open, setOpen] = useState(false);
  const { user, isLoggedIn, login: contextLogin, logout: contextLogout } = useUser();
  const navigate = useNavigate();

  // 页面加载时，如果有 token 但 UserContext 还没有用户信息，则恢复
  useEffect(() => {
    if (!isLoggedIn && authService.isAuthenticated()) {
      authService.getCurrentUser()
        .then((backendUser) => {
          contextLogin({
            id: backendUser.id,
            fullName: backendUser.nickname,
            email: backendUser.phone,
            avatar: backendUser.avatar_url,
            isProfileComplete: false,
          });
        })
        .catch(() => {
          authService.clearTokens();
        });
    }
  }, []);

  // 用户名/密码登录（email 字段承载 username 或 phone）
  const handleLogin = async ({ email, role }: { email: string; password?: string; role: 'patient' | 'doctor' }) => {
    // ========== 【临时死代码 - 前端写死登录，无论账号密码均可通过】START ==========
    contextLogin({
      id: 'temp-user',
      fullName: role === 'doctor' ? '李医生' : '测试用户',
      email: email || 'temp@test.com',
      isProfileComplete: false,
      role,
    });
    setOpen(false);
    navigate(role === 'doctor' ? '/doctor-consult' : '/', { replace: true });
    return;
    // ========== 【临时死代码】END ==========

    // ========== 【原始登录逻辑 - 恢复时删除上方死代码（含 return）并取消以下注释】START ==========
    // try {
    //   const isPhone = /^1\d{10}$/.test(email);
    //   const data = await authService.login(
    //     isPhone ? { phone: email, code: password } : { username: email, password },
    //   );
    //   contextLogin({
    //     id: data.user.id,
    //     fullName: data.user.nickname,
    //     email: data.user.phone,
    //     avatar: data.user.avatar_url,
    //     isProfileComplete: false,
    //     role,
    //   });
    //   navigate(role === 'doctor' ? '/doctor-consult' : '/consult', { replace: true });
    // } catch (error: unknown) {
    //   message.error(error instanceof Error ? error.message : '登录失败');
    //   throw error;
    // }
    // ========== 【原始登录逻辑】END ==========
  };

  // 注册
  const handleRegister = async (payload: { phone: string; password: string; nickname?: string }) => {
    try {
      await authService.register({
        phone: payload.phone,
        password: payload.password,
        nickname: payload.nickname || '',
      });
    } catch (error: unknown) {
      message.error(error instanceof Error ? error.message : '注册失败');
      throw error;
    }
  };

  // 发送验证码（前端 'forgot' → 后端 'reset_password'）
  const handleSendCode = async (phone: string, scene: 'login' | 'register' | 'reset_password') => {
    try {
      const data = await authService.sendCode({ phone, scene });
      if (data.code) {
        message.info(`开发模式 - 验证码: ${data.code}`, 8);
      }
    } catch (error: unknown) {
      message.error(error instanceof Error ? error.message : '发送验证码失败');
      throw error;
    }
  };

  // 重置密码
  const handleResetPassword = async (payload: { phone: string; code: string; newPassword: string }) => {
    try {
      await authService.resetPassword(payload);
    } catch (error: unknown) {
      message.error(error instanceof Error ? error.message : '重置密码失败');
      throw error;
    }
  };

  // 登出
  const handleLogout = async () => {
    try {
      await authService.logout();
      contextLogout();
      message.success('已登出');
    } catch (error: unknown) {
      message.error(error instanceof Error ? error.message : '登出失败');
    }
  };

  return (
    <>
      {isLoggedIn ? (
        <div className="user-info">
          <span className="user-nickname">{user?.fullName}</span>
          <button className="login-btn" onClick={handleLogout}>
            <LogoutOutlined />
            <span>退出</span>
          </button>
        </div>
      ) : (
        <button className="login-btn" onClick={() => setOpen(true)}>
          <UserOutlined />
          <span>登录</span>
        </button>
      )}
      <AuthModal
        open={open}
        onClose={() => setOpen(false)}
        onLogin={handleLogin}
        onRegister={handleRegister}
        onSendCode={handleSendCode}
        onResetPassword={handleResetPassword}
      />
    </>
  );
};

const Logo: React.FC = () => (
  <div className="logo-container">
    <Link to="/" className="logo">
      <div className="logo-icon">
        <img src={lg2} alt="乳此安心 Logo" className="logo-image" />
      </div>
      <div className="logo-text">
        <h1 className="logo-title">乳此安心——您的线上乳腺癌防治平台</h1>
        <p className="logo-subtitle">RCAX-Your breast cancer prevention and treatment platform</p>
      </div>
    </Link>
  </div>
);

const MainNav: React.FC = () => {
  const location = useLocation();
  const isActive = (p: string) => {
    if (p === '/') return location.pathname === '/';
    return location.pathname.includes(p);
  };
  return (
    <nav className="main-nav">
      <Link to="/"       className={`nav-item ${isActive('/') ? 'active' : ''}`}>首页</Link>
      <Link to="/consult" className={`nav-item ${isActive('/consult') ? 'active' : ''}`}>在线咨询</Link>
      <Link to="/profile" className={`nav-item ${isActive('/profile') ? 'active' : ''}`}>我的</Link>
      <Link to="/info"    className={`nav-item ${isActive('/info') || isActive('/news') || isActive('/announcement') ? 'active' : ''}`}>健康资讯</Link>
      <Link to="/shop"    className={`nav-item ${isActive('/shop') ? 'active' : ''}`}>精品商城</Link>
    </nav>
  );
};

const Header: React.FC<{ onSearch: (term: string) => void }> = ({ onSearch }) => {
  const handleSearch = () => {
    const input = document.querySelector('.search-input') as HTMLInputElement;
    if (input?.value) onSearch(input.value);
  };
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') onSearch(e.currentTarget.value);
  };
  return (
    <header className="header-wrapper">
      <div className="header-top-section">
        <div className="logo-section">
          <div className="logo-top-bar"></div>
          <div className="logo-main-bar"><Logo /></div>
        </div>
        <div className="nav-section">
          <div className="nav-top-bar"><AuthButton /></div>
          <div className="nav-main-bar"><MainNav /></div>
        </div>
      </div>
      <div className="search-section">
        <div className="search-bar">
          <Input
            className="search-input"
            placeholder="搜索健康资讯..."
            prefix={<SearchOutlined />}
            onPressEnter={handleKeyPress}
          />
          <Button type="primary" onClick={handleSearch}>搜索</Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
