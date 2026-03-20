import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';

export type Gender = 'male' | 'female' | 'other';

export interface Profile {
  id: string;
  avatar?: string;
  fullName: string;
  dob?: string;
  gender?: Gender;
  email: string;
  phone?: string;
  street?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  linkedin?: string;
  twitter?: string;
  website?: string;
  title?: string;
  verified?: boolean;
  premium?: boolean;
}

export interface User {
  id: string;
  fullName: string;
  email: string;
  avatar?: string;
  phone?: string;
  isProfileComplete: boolean;
  profile?: Profile;
  role?: 'patient' | 'doctor';
}

interface UserContextType {
  user: User | null;
  isLoggedIn: boolean;
  login: (userData: User) => void;
  logout: () => void;
  updateAvatar: (avatar: string) => void;
  updateProfile: (profile: Partial<Profile>) => void;
  checkProfileComplete: () => boolean;
}

const UserContext = createContext<UserContextType | null>(null);

const USER_STORAGE_KEY = 'rcax_user';

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(USER_STORAGE_KEY);
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {
          console.error('Failed to parse user data:', e);
          return null;
        }
      }
    }
    return null;
  });

  const isLoggedIn = !!user;

  const login = useCallback((userData: User) => {
    setUser(userData);
    if (typeof window !== 'undefined') {
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userData));
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem(USER_STORAGE_KEY);
      localStorage.removeItem('rcax_profile_personal_info');
    }
  }, []);

  const updateAvatar = useCallback((avatar: string) => {
    setUser(prev => {
      if (!prev) return null;
      const updated = { ...prev, avatar };
      if (typeof window !== 'undefined') {
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(updated));
      }
      return updated;
    });
  }, []);

  const updateProfile = useCallback((profileUpdate: Partial<Profile>) => {
    setUser(prev => {
      if (!prev) return null;
      const updatedProfile = { ...prev.profile, ...profileUpdate } as Profile;
      const isComplete = !!(
        updatedProfile.fullName &&
        updatedProfile.email &&
        updatedProfile.phone &&
        updatedProfile.city
      );
      const updated = { 
        ...prev, 
        profile: updatedProfile,
        isProfileComplete: isComplete,
        fullName: updatedProfile.fullName || prev.fullName,
        avatar: updatedProfile.avatar || prev.avatar,
        phone: updatedProfile.phone || prev.phone,
      };
      if (typeof window !== 'undefined') {
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(updated));
      }
      return updated;
    });
  }, []);

  const checkProfileComplete = useCallback(() => {
    if (!user) return false;
    return user.isProfileComplete;
  }, [user]);

  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === USER_STORAGE_KEY) {
        if (e.newValue) {
          try {
            setUser(JSON.parse(e.newValue));
          } catch (err) {
            console.error('Failed to sync user data:', err);
          }
        } else {
          setUser(null);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return (
    <UserContext.Provider value={{
      user,
      isLoggedIn,
      login,
      logout,
      updateAvatar,
      updateProfile,
      checkProfileComplete
    }}>
      {children}
    </UserContext.Provider>
  );
};

// 修改：添加安全检查，避免在没有 Provider 时出错
export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    // 返回默认值而不是抛出错误，避免组件崩溃
    console.warn('useUser must be used within UserProvider');
    return {
      user: null,
      isLoggedIn: false,
      login: () => {},
      logout: () => {},
      updateAvatar: () => {},
      updateProfile: () => {},
      checkProfileComplete: () => false,
    } as UserContextType;
  }
  return context;
};

export default UserContext;
