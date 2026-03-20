import React from 'react';
import type { Profile } from './profile.types';
import { CheckCircle, Star } from 'lucide-react';

interface Props {
  profile: Profile;
  onEditProfile: () => void;
  onChangePassword: () => void;
}

const ProfileOverview: React.FC<Props> = ({ profile, onEditProfile, onChangePassword }) => {
  return (
    <aside className="pi-overview" aria-label="Profile Overview">
      <div className="pi-card">
        <div className="pi-avatar-wrap" role="img" aria-label="User avatar">
          {profile.avatar ? (
            <img className="pi-avatar" src={profile.avatar} alt="avatar" />
          ) : (
            <div className="pi-avatar pi-avatar--placeholder">{profile.fullName?.[0] || 'U'}</div>
          )}
        </div>

        <div className="pi-name">{profile.fullName || '未命名用户'}</div>
        <div className="pi-email" title={profile.email}>{profile.email}</div>
        <div className="pi-title">{profile.title || '用户'}</div>

        <div className="pi-badges">
          {profile.verified && (
            <div className="pi-badge pi-badge-verified">
              <CheckCircle size={14} />
              <span>已认证</span>
            </div>
          )}
          {profile.premium && (
            <div className="pi-badge pi-badge-premium">
              <Star size={14} />
              <span>高级会员</span>
            </div>
          )}
        </div>

        <button onClick={onEditProfile} className="pi-btn pi-btn-primary">
          编辑资料
        </button>
        <button onClick={onChangePassword} className="pi-btn pi-btn-default">
          修改密码
        </button>
      </div>
    </aside>
  );
};

export default ProfileOverview;
