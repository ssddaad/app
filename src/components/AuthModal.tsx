import React, { useEffect, useRef, useState } from 'react';
import { Modal, Form, Input, Button, Divider, message } from 'antd';
import lg2 from './logo2.png';

export type AuthMode = 'login' | 'register' | 'forgot';
export type UserRole = 'patient' | 'doctor' | null;

interface AuthModalProps {
  open: boolean;
  mode?: AuthMode;
  onClose: () => void;
  // 登录回调（email 字段可能为用户名或手机号，password 为密码或验证码，role 为用户选择的身份）
  onLogin?: (payload: { email: string; password: string; role: 'patient' | 'doctor' }) => Promise<void> | void;
  // 注册回调
  onRegister?: (payload: {
    phone: string;
    password: string;
    nickname?: string;
  }) => Promise<void> | void;
  // 发送验证码回调
  onSendCode?: (phone: string, scene: 'login' | 'register' | 'reset_password') => Promise<void> | void;
  // 重置密码回调
  onResetPassword?: (payload: { phone: string; code: string; newPassword: string }) => Promise<void> | void;
  brandTitle?: string;
  brandSubtitle?: string;
}

// 统一的密码规则（与后端一致）
const passwordRule = [
  { required: true, message: '请输入密码' },
  { min: 8, message: '密码长度至少为 8 个字符' },
  {
    pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
    message: '密码必须包含大小写字母、数字和特殊字符(@$!%*?&)',
  },
];

// 统一的昵称规则（与后端一致）
const nicknameRule = [
  { required: true, message: '请输入昵称' },
  { min: 2, message: '昵称长度至少为 2 个字符' },
  { max: 50, message: '昵称长度最多为 50 个字符' },
  {
    pattern: /^[\u4e00-\u9fa5a-zA-Z0-9_]+$/,
    message: '昵称只能包含中文、字母、数字和下划线',
  },
];

const AuthModal: React.FC<AuthModalProps> = ({
  open,
  mode = 'login',
  onClose,
  onLogin,
  onRegister,
  onSendCode,
  onResetPassword,
  brandTitle = '欢迎回来',
  brandSubtitle = '使用用户名/手机号登录或注册新账号',
}) => {
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);
  const [currMode, setCurrMode] = useState<AuthMode>(mode);
  const [loginMethod, setLoginMethod] = useState<'username' | 'phone'>('username');
  const [selectedRole, setSelectedRole] = useState<UserRole>(null);

  // 验证码发送相关
  const [sending, setSending] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    if (open) setSelectedRole(null);
    setCurrMode(mode);
    if (mode === 'register') setLoginMethod('username');
    form.resetFields();
  }, [mode, open, form]);

  useEffect(() => {
    if (countdown === 0 && timerRef.current) {
      window.clearInterval(timerRef.current);
      timerRef.current = null;
      setSending(false);
    }
  }, [countdown]);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        window.clearInterval(timerRef.current);
      }
    };
  }, []);

  const switchMode = (m: AuthMode) => {
    console.log('[AuthModal] Switching mode to:', m);
    setCurrMode(m);
    setLoginMethod('username');
    form.resetFields();
    setCountdown(0);
    setSending(false);
    if (timerRef.current) {
      window.clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const switchLoginMethod = (m: 'username' | 'phone') => {
    console.log('[AuthModal] Switching login method to:', m);
    setLoginMethod(m);
    if (m === 'username') {
      form.resetFields(['phone', 'code']);
    } else {
      form.resetFields(['username', 'password']);
    }
    setCountdown(0);
    setSending(false);
  };

  const handleOk = () => form.submit();

  const handleFinish = async (values: any) => {
    console.log('[AuthModal] Form submitted with values:', values);
    console.log('[AuthModal] Current mode:', currMode);
    
    try {
      setSubmitting(true);
      
      if (currMode === 'login') {
        // ========== 【临时死代码 - 前端写死登录，无论账号密码均可通过】START ==========
        await onLogin?.({ email: values.username || values.phone || '', password: '', role: selectedRole ?? 'patient' });
        // ========== 【临时死代码】END ==========

        // ========== 【原始登录逻辑 - 恢复时删除上方死代码并取消以下注释】START ==========
        // if (loginMethod === 'username') {
        //   const username = values.username;
        //   const password = values.password;
        //   console.log('[AuthModal] Username/Password login:', { username });
        //   await onLogin?.({ email: username, password, role: selectedRole ?? 'patient' });
        //   message.success('登录成功');
        //   onClose();
        // } else {
        //   const phone = values.phone;
        //   const code = values.code;
        //   console.log('[AuthModal] Phone/Code login:', { phone });
        //   await onLogin?.({ email: phone, password: code, role: selectedRole ?? 'patient' });
        //   message.success('登录成功');
        //   onClose();
        // }
        // ========== 【原始登录逻辑】END ==========
      } else if (currMode === 'register') {
        // 注册（只传递后端需要的字段）
        console.log('[AuthModal] Register with:', { 
          phone: values.phone, 
          nickname: values.nickname 
        });
        await onRegister?.({
          phone: values.phone,
          password: values.password,
          nickname: values.nickname,
        });
        message.success('注册成功，请使用账号登录');
        switchMode('login');
      } else if (currMode === 'forgot') {
        // 重置密码
        console.log('[AuthModal] Reset password for:', { phone: values.phone });
        await onResetPassword?.({ 
          phone: values.phone, 
          code: values.code, 
          newPassword: values.newPassword 
        });
        message.success('密码重置成功，请使用新密码登录');
        switchMode('login');
      }
    } catch (e: any) {
      console.error('[AuthModal] Operation failed:', e);
      message.error(e?.message || '操作失败，请稍后再试');
    } finally {
      setSubmitting(false);
    }
  };

  const passwordStrength = (pwd?: string) => {
    if (!pwd) return '';
    const strong = /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s]).{10,}/;
    const medium = /(?=.*[a-zA-Z])(?=.*\d).{8,}/;
    if (strong.test(pwd)) return '强';
    if (medium.test(pwd)) return '中';
    if (pwd.length >= 8) return '弱';
    return '';
  };

  // 简单手机号校验（中国手机号）
  const phoneRule = [
    { required: true, message: '请输入手机号' },
    { pattern: /^1\d{10}$/, message: '手机号格式不正确' },
  ];

  const sendCode = async () => {
    try {
      await form.validateFields(['phone']);
    } catch {
      return;
    }
    const phone = form.getFieldValue('phone');
    console.log('[AuthModal] Sending code to:', phone, 'scene:', currMode);
    
    setSending(true);
    setCountdown(60);

    if (timerRef.current) {
      window.clearInterval(timerRef.current);
    }
    timerRef.current = window.setInterval(() => {
      setCountdown((c) => (c <= 1 ? 0 : c - 1));
    }, 1000);

    try {
      if (onSendCode) {
        const scene = currMode === 'login' ? 'login' : currMode === 'register' ? 'register' : 'reset_password';
        console.log('[AuthModal] Calling onSendCode with scene:', scene);
        await onSendCode(phone, scene);
        message.success(`验证码已发送到 ${phone}`);
      } else {
        console.warn('[AuthModal] onSendCode not provided');
        await new Promise((res) => setTimeout(res, 600));
        message.success(`验证码已发送到 ${phone}`);
      }
    } catch (e: any) {
      console.error('[AuthModal] Send code failed:', e);
      message.error(e?.message || '验证码发送失败');
      if (timerRef.current) {
        window.clearInterval(timerRef.current);
        timerRef.current = null;
      }
      setCountdown(0);
      setSending(false);
    }
  };

  return (
    <Modal
      open={open}
      onCancel={onClose}
      onOk={handleOk}
      okText={
        currMode === 'login'
          ? '快速登录'
          : currMode === 'register'
          ? '立即注册'
          : '重置密码'
      }
      cancelText="取消"
      title={null}
      width={selectedRole === null ? 760 : 880}
      className="auth-modal"
      confirmLoading={submitting}
      destroyOnClose
      bodyStyle={{ padding: 0 }}
      footer={null}
    >
      {selectedRole === null ? (
        <div className="role-select-grid">
          {/* 患者端 */}
          <button className="role-card role-patient" onClick={() => setSelectedRole('patient')}>
            <div className="role-icon-wrap role-icon-patient">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="44" height="44">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </div>
            <div className="role-label">我是患者</div>
            <div className="role-desc">在线咨询 · 预约挂号 · 健康管理</div>
            <div className="role-arrow">进入 →</div>
          </button>

          <div className="role-divider"><span>或</span></div>

          {/* 医生端 */}
          <button className="role-card role-doctor" onClick={() => setSelectedRole('doctor')}>
            <div className="role-icon-wrap role-icon-doctor">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="44" height="44">
                <path d="M12 2a5 5 0 1 1 0 10A5 5 0 0 1 12 2z" />
                <path d="M2 20c0-4 4-7 10-7s10 3 10 7" />
                <line x1="17" y1="13" x2="17" y2="17" />
                <line x1="15" y1="15" x2="19" y2="15" />
              </svg>
            </div>
            <div className="role-label">我是医生</div>
            <div className="role-desc">接诊患者 · 管理问诊 · 医生工作台</div>
            <div className="role-arrow">进入 →</div>
          </button>
        </div>
      ) : (
      <div className="auth-grid">
        {/* 左侧内容：在容器中居中显示 */}
        <div className="auth-content">
          <div className="auth-left">
            <div className="auth-left-header">
              <div className="auth-role-back">
                <button className="auth-back-btn" onClick={() => { setSelectedRole(null); form.resetFields(); }}>
                  ← 重新选择身份
                </button>
                <span className={`auth-role-badge ${selectedRole === 'doctor' ? 'badge-doctor' : 'badge-patient'}`}>
                  {selectedRole === 'doctor' ? '🩺 医生端' : '👤 患者端'}
                </span>
              </div>
            </div>
            <div className="auth-left-body">
              <Form
                form={form}
                layout="vertical"
                onFinish={handleFinish}
                requiredMark={false}
                preserve={false}
              >
                {currMode === 'login' ? (
                  <>
                    {loginMethod === 'username' ? (
                      <>
                        <Form.Item
                          name="username"
                          label="用户名"
                          rules={[{ required: true, message: '请输入用户名' }, { min: 2, message: '用户名至少2个字符' }, { max: 50, message: '用户名最多50个字符' }]}
                        >
                          <Input placeholder="请输入用户名" />
                        </Form.Item>

                        <Form.Item name="password" label="密码" rules={passwordRule}>
                          <Input.Password placeholder="请输入密码" />
                        </Form.Item>
                      </>
                    ) : (
                      <>
                        <Form.Item name="phone" label="手机号" rules={phoneRule}>
                          <Input placeholder="请输入手机号" />
                        </Form.Item>

                        <Form.Item label="验证码" style={{ marginBottom: 0 }}>
                          <div style={{ display: 'flex', gap: 8 }}>
                            <Form.Item
                              name="code"
                              noStyle
                              rules={[
                                { required: true, message: '请输入验证码' },
                                { len: 6, message: '请输入 6 位验证码' },
                              ]}
                            >
                              <Input placeholder="请输入验证码" />
                            </Form.Item>
                            <Button
                              type="default"
                              onClick={sendCode}
                              disabled={sending || countdown > 0}
                              style={{ whiteSpace: 'nowrap' }}
                            >
                              {countdown > 0 ? `${countdown} s` : '发送验证码'}
                            </Button>
                          </div>
                        </Form.Item>
                      </>
                    )}
                  </>
                ) : currMode === 'register' ? (
                  // 注册表单
                  <>
                    <Form.Item name="phone" label="手机号" rules={phoneRule}>
                      <Input placeholder="请输入手机号" />
                    </Form.Item>

                    <Form.Item
                      name="nickname"
                      label="用户名"
                      rules={nicknameRule}
                    >
                      <Input placeholder="给自己取个名字吧" />
                    </Form.Item>

                    <Form.Item name="password" label="密码" rules={passwordRule}>
                      <Input.Password placeholder="请输入密码（至少8位，含大小写字母、数字和特殊字符）" />
                    </Form.Item>

                    <Form.Item
                      name="confirm"
                      label="确认密码"
                      dependencies={['password']}
                      rules={[
                        { required: true, message: '请再次输入密码' },
                        ({ getFieldValue }) => ({
                          validator(_, value) {
                            if (!value || getFieldValue('password') === value) return Promise.resolve();
                            return Promise.reject(new Error('两次输入的密码不一致'));
                          },
                        }),
                      ]}
                    >
                      <Input.Password placeholder="请再次输入密码" />
                    </Form.Item>

                    <Form.Item
                      name="agree"
                      valuePropName="checked"
                      rules={[
                        {
                          validator: (_, v) =>
                            v ? Promise.resolve() : Promise.reject(new Error('请阅读并同意协议')),
                        },
                      ]}
                    >
                      <label className="agree-wrap">
                        <input type="checkbox" />
                        <span>
                          我已阅读并同意
                          <a onClick={(e) => e.preventDefault()}>《用户协议》</a>
                          和
                          <a onClick={(e) => e.preventDefault()}>《隐私政策》</a>
                        </span>
                      </label>
                    </Form.Item>
                  </>
                ) : (
                  // 忘记密码表单
                  <>
                    <Form.Item name="phone" label="手机号" rules={phoneRule}>
                      <Input placeholder="请输入手机号" />
                    </Form.Item>

                    <Form.Item label="验证码" style={{ marginBottom: 0 }}>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <Form.Item
                          name="code"
                          noStyle
                          rules={[
                            { required: true, message: '请输入验证码' },
                            { len: 6, message: '请输入 6 位验证码' },
                          ]}
                        >
                          <Input placeholder="请输入验证码" />
                        </Form.Item>
                        <Button
                          type="default"
                          onClick={sendCode}
                          disabled={sending || countdown > 0}
                          style={{ whiteSpace: 'nowrap' }}
                        >
                          {countdown > 0 ? `${countdown} s` : '发送验证码'}
                        </Button>
                      </div>
                    </Form.Item>

                    <Form.Item name="newPassword" label="新密码" rules={passwordRule}>
                      <Input.Password placeholder="请输入新密码（至少8位，含大小写字母、数字和特殊字符）" />
                    </Form.Item>
                  </>
                )}

                {/* 密码强度提示 */}
                <Form.Item noStyle shouldUpdate>
                  {() => {
                    const pwd = form.getFieldValue('password') || form.getFieldValue('newPassword');
                    const level = passwordStrength(pwd);
                    return level ? <div className={`pwd-strength pwd-${level}`}>密码强度：{level}</div> : null;
                  }}
                </Form.Item>

                <Button
                  type="primary"
                  htmlType="submit"
                  block
                  size="large"
                  className="auth-submit"
                  loading={submitting}
                >
                  {currMode === 'login'
                    ? '快速登录'
                    : currMode === 'register'
                    ? '立即注册'
                    : '重置密码'}
                </Button>

                <Divider plain>———</Divider>

                <div className="auth-bottom-row">
                  <div className="auth-bottom-left">
                    {currMode === 'login' ? (
                      loginMethod === 'username' ? (
                        <Button type="link" onClick={() => switchLoginMethod('phone')}>
                          使用手机号验证码登录
                        </Button>
                      ) : (
                        <Button type="link" onClick={() => switchLoginMethod('username')}>
                          使用用户名密码登录
                        </Button>
                      )
                    ) : (
                      <span style={{ color: '#6b7280' }} />
                    )}
                  </div>

                  <div className="auth-bottom-right">
                    {currMode === 'login' ? (
                      <>
                        <Button type="link" onClick={() => switchMode('forgot')}>
                          忘记密码？
                        </Button>
                        没有账号？
                        <Button type="link" onClick={() => switchMode('register')}>
                          去注册
                        </Button>
                      </>
                    ) : (
                      <>
                        已有账号？
                        <Button type="link" onClick={() => switchMode('login')}>
                          去登录
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </Form>
            </div>
          </div>
        </div>

        {/* 右侧品牌区 */}
        <aside className="auth-aside">
          <div className="auth-modal-header">
            <div className="auth-modal-logo">
              <img src={lg2} alt="品牌 Logo" className="auth-modal-logo-img" />
            </div>

            <h2 className="auth-modal-title">{brandTitle}</h2>
            <p className="auth-modal-subtitle">{brandSubtitle}</p>
          </div>
        </aside>
      </div>
      )}

      {/* 内联样式 */}
      <style>
        {`
        .auth-modal .ant-modal-body { padding: 0; }
        .auth-grid {
          display: grid;
          grid-template-columns: 2fr 1fr;
          min-height: 460px;
        }
        .auth-content {
          padding: 24px 28px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .auth-left { width: 100%; max-width: 520px; }
        .auth-left-body { width: 100%; }
        .auth-aside {
          border-left: 1px solid #e5e7eb;
          display: flex; align-items: center; justify-content: center;
          padding: 28px 20px; text-align: center;
        }
        .auth-modal-logo { width:112px; height:112px; margin:0 auto 16px; color:#1677ff; }
        .auth-modal-logo img {
          width: 100%;
          height: 100%;
          object-fit: contain;
          display: block;
        }

        .auth-modal-title { margin:0; font-size:20px; font-weight:600; color:#111827; }
        .auth-modal-subtitle { margin:6px 0 0; font-size:13px; color:#6b7280; }
        .auth-submit { margin-top:8px; }
        .agree-wrap { display:flex; gap:8px; align-items:center; color:#4b5563; }
        .agree-wrap a { color:#1677ff; }
        .pwd-strength { margin:8px 0 4px; font-size:12px; color:#6b7280; }

        .auth-bottom-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: 12px;
        }
        .auth-bottom-left { text-align: left; color: #6b7280; }
        .auth-bottom-right { text-align: right; color: #6b7280; }

        @media (max-width: 767px) {
          .auth-grid { grid-template-columns: 1fr; }
          .auth-aside { display:none; }
          .auth-content { padding: 20px 16px; }
        }

        /* ── 角色选择 ── */
        .role-select-grid {
          display: grid;
          grid-template-columns: 1fr auto 1fr;
          min-height: 380px;
        }
        .role-card {
          all: unset;
          cursor: pointer;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 14px;
          padding: 48px 36px;
          transition: background 0.2s ease;
        }
        .role-patient:hover { background: #fff5f7; }
        .role-doctor:hover  { background: #f0fdf9; }
        .role-icon-wrap {
          width: 88px;
          height: 88px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: transform 0.25s ease, box-shadow 0.25s ease;
        }
        .role-card:hover .role-icon-wrap {
          transform: scale(1.08);
          box-shadow: 0 8px 24px rgba(0,0,0,0.12);
        }
        .role-icon-patient {
          background: linear-gradient(135deg, #ffd6e3 0%, #ffb3cb 100%);
          color: #e83e8c;
        }
        .role-icon-doctor {
          background: linear-gradient(135deg, #b2f0e8 0%, #7de3d6 100%);
          color: #0d9488;
        }
        .role-label {
          font-size: 22px;
          font-weight: 700;
          color: #111827;
        }
        .role-desc {
          font-size: 13px;
          color: #6b7280;
          text-align: center;
          line-height: 1.6;
        }
        .role-arrow {
          font-size: 13px;
          font-weight: 600;
          opacity: 0;
          transform: translateX(-6px);
          transition: opacity 0.2s, transform 0.2s;
        }
        .role-patient .role-arrow { color: #e83e8c; }
        .role-doctor  .role-arrow { color: #0d9488; }
        .role-card:hover .role-arrow {
          opacity: 1;
          transform: translateX(0);
        }
        .role-divider {
          display: flex;
          align-items: center;
          justify-content: center;
          writing-mode: vertical-rl;
          color: #d1d5db;
          font-size: 13px;
          padding: 0 8px;
          border-left: 1px solid #f3f4f6;
          border-right: 1px solid #f3f4f6;
        }
        /* ── 返回按钮 & 角色徽章 ── */
        .auth-role-back {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 16px;
        }
        .auth-back-btn {
          background: none;
          border: none;
          cursor: pointer;
          font-size: 13px;
          color: #9ca3af;
          padding: 0;
          transition: color 0.2s;
        }
        .auth-back-btn:hover { color: #374151; }
        .auth-role-badge {
          display: inline-block;
          padding: 3px 12px;
          border-radius: 999px;
          font-size: 12px;
          font-weight: 600;
        }
        .badge-patient {
          background: #fff0f5;
          color: #e83e8c;
          border: 1px solid #ffd6e3;
        }
        .badge-doctor {
          background: #f0fdf9;
          color: #0d9488;
          border: 1px solid #99f0e4;
        }
        `}
      </style>
    </Modal>
  );
};

export default AuthModal;
