import React, { useCallback, useState, useEffect } from 'react';
import ProfileOverview from './ProfileOverview';
import EditInformationForm from './EditInformationForm';
import type { Profile } from './profile.types';
import { storage } from '../../utils/storage';
import './profile.css';
import Header from '@/components/header';
import { useUser } from '@/components/userContext';
import authService from '@/auth.service';

const STORAGE_KEY = 'rcax_profile_personal_info';

/**
 * 将后端用户数据合并到本地 Profile
 * 后端字段：id, phone, nickname, avatar_url
 * Profile 字段：id, fullName, email(phone), avatar, ...
 */
function mergeBackendUser(
  local: Profile,
  backendUser: { id: string; phone: string; nickname: string; avatar_url?: string },
): Profile {
  return {
    ...local,
    id: backendUser.id,
    fullName: backendUser.nickname || local.fullName,
    // Profile.email 字段用于展示，这里存放手机号
    email: backendUser.phone || local.email,
    avatar: backendUser.avatar_url || local.avatar,
  };
}

const defaultProfile: Profile = {
  id: 'u_guest',
  fullName: '用户名',
  email: '',
  phone: '',
  title: '乳此安心用户',
  verified: false,
  premium: false,
  dob: '',
  gender: undefined,
  street: '',
  city: '',
  state: '',
  postalCode: '',
  linkedin: '',
  twitter: '',
  website: '',
};

const PersonalInfoPage: React.FC = () => {
  const { user: contextUser, isLoggedIn } = useUser();

  const [profile, setProfile] = useState<Profile>(() =>
    storage.get<Profile>(STORAGE_KEY, defaultProfile),
  );

  // 登录后从后端拉取最新用户信息并合并到 profile
  useEffect(() => {
    if (!isLoggedIn) return;

    authService
      .getCurrentUser()
      .then((backendUser) => {
        setProfile((prev) => {
          const merged = mergeBackendUser(prev, backendUser);
          storage.set(STORAGE_KEY, merged);
          return merged;
        });
      })
      .catch(() => {
        // token 失效等情况，静默处理，保持本地缓存
      });
  }, [isLoggedIn]);

  // contextUser 变化时也同步（如登录/登出）
  useEffect(() => {
    if (contextUser) {
      setProfile((prev) => ({
        ...prev,
        id: contextUser.id,
        fullName: contextUser.fullName || prev.fullName,
        avatar: contextUser.avatar || prev.avatar,
      }));
    }
  }, [contextUser]);

  const handleSave = useCallback(async (p: Profile) => {
    await new Promise((r) => setTimeout(r, 500));
    storage.set(STORAGE_KEY, p);
    setProfile(p);
  }, []);

  const onEditProfile = useCallback(() => {
    const el = document.querySelector('#pi-editor-root');
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, []);

  const onChangePassword = useCallback(() => {
    alert('修改密码功能（待实现）');
  }, []);

  return (
    <div className="min-h-screen bg-[#fafafa] flex flex-col">
      <Header onSearch={() => {}} />
      <div className="w-full p-4 md:p-6 flex-1">
        <header className="pi-header">
          <p className="pi-subheading">更新头像、联系方式与账户偏好设置</p>
        </header>

        <div className="pi-layout">
          <aside className="pi-aside">
            <ProfileOverview
              profile={profile}
              onEditProfile={onEditProfile}
              onChangePassword={onChangePassword}
            />
          </aside>

          <main className="pi-main" id="pi-editor-root">
            <EditInformationForm
              key={profile.id}
              initial={profile}
              onSave={handleSave}
            />
          </main>
        </div>
      </div>
    </div>
  );
};

export default PersonalInfoPage;
