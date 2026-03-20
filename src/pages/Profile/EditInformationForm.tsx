import React, { 
  useEffect, 
  useState, 
  useRef, 
  useCallback, 
  useMemo,
  memo 
} from 'react';
import type { Profile } from './profile.types';
import { isEmail, isPhone, isURL, isPostal } from './profile.validators';
import { shallowEqual } from '../../utils/form';
import { Upload, RotateCcw, Trash2, Save, Check, AlertCircle } from 'lucide-react';
import { useDebounce } from '../../hooks/useDebounce';

interface Props {
  initial: Profile;
  onSave: (p: Profile) => Promise<void> | void;
}

// 分离头像处理逻辑
const useAvatar = (initialAvatar?: string) => {
  const [preview, setPreview] = useState<string>(initialAvatar || '');
  const fileRef = useRef<File | null>(null);
  const objectUrlRef = useRef<string>('');

  useEffect(() => {
    return () => {
      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current);
      }
    };
  }, []);

  const handleFileSelect = useCallback((file: File): string | null => {
    if (!file.type.startsWith('image/')) {
      return '仅支持图片文件';
    }

    const sizeMB = file.size / 1024 / 1024;
    if (sizeMB > 3) {
      return '图片不能超过 3MB';
    }

    fileRef.current = file;
    
    // 使用 ObjectURL 替代 Base64，性能更好
    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current);
    }
    objectUrlRef.current = URL.createObjectURL(file);
    setPreview(objectUrlRef.current);

    return null;
  }, []);

  const getAvatarForSave = useCallback(async (): Promise<string | undefined> => {
    if (!fileRef.current) return preview;
    
    // 实际项目中这里应该上传到服务器，返回 URL
    // 现在转换为 Base64 存储
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.readAsDataURL(fileRef.current!);
    });
  }, [preview]);

  const resetAvatar = useCallback((url?: string) => {
    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current);
      objectUrlRef.current = '';
    }
    fileRef.current = null;
    setPreview(url || '');
  }, []);

  return { preview, handleFileSelect, getAvatarForSave, resetAvatar };
};

// 表单字段组件，减少重渲染
interface FieldProps {
  label: string;
  name: string;
  value: string;
  error?: string;
  required?: boolean;
  type?: string;
  placeholder?: string;
  onChange: (name: string, value: string) => void;
  onBlur: (name: string, value: string) => void;
}

const FormField = memo<FieldProps>(({
  label, name, value, error, required, type = 'text', placeholder, onChange, onBlur
}) => {
  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    onChange(name, e.target.value);
  }, [name, onChange]);

  const handleBlur = useCallback((e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
    onBlur(name, e.target.value);
  }, [name, onBlur]);

  return (
    <div className="pi-form-group">
      <label className="pi-label">
        {label}
        {required && <span className="pi-required"> *</span>}
      </label>
      {type === 'select' ? (
        <select
          value={value}
          onChange={handleChange}
          className={`pi-input ${error ? 'pi-input-error' : ''}`}
        >
          <option value="">请选择</option>
          <option value="male">男性</option>
          <option value="female">女性</option>
          <option value="other">其他</option>
        </select>
      ) : (
        <input
          type={type}
          value={value}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder={placeholder}
          className={`pi-input ${error ? 'pi-input-error' : ''}`}
        />
      )}
      {error && <div className="pi-error">{error}</div>}
    </div>
  );
});

FormField.displayName = 'FormField';

const EditInformationForm: React.FC<Props> = ({ initial, onSave }) => {
  // 使用 ref 存储初始值，避免重渲染
  const initialRef = useRef<Profile>(initial);
  const [values, setValues] = useState<Profile>(initial);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Set<string>>(new Set());
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const lastSavedRef = useRef<Profile>(initial);

  // 头像单独管理
  const { preview, handleFileSelect, getAvatarForSave, resetAvatar } = useAvatar(initial.avatar);

  // 计算是否有变更 - 使用 useMemo 缓存
  const hasChanges = useMemo(() => {
    const currentWithAvatar = { ...values, avatar: preview };
    const lastSavedWithAvatar = { ...lastSavedRef.current, avatar: lastSavedRef.current.avatar || '' };
    return !shallowEqual(currentWithAvatar, lastSavedWithAvatar);
  }, [values, preview]);

  // 验证单个字段
  const validateField = useCallback((name: string, value: any): string => {
    switch (name) {
      case 'fullName':
        if (!value?.trim()) return '请输入全名';
        if (value.length > 60) return '全名不能超过60个字符';
        return '';
      case 'email':
        if (!value?.trim()) return '请输入邮箱';
        if (!isEmail(value)) return '邮箱格式不正确';
        return '';
      case 'phone':
        if (value && !isPhone(value)) return '电话号码格式不正确';
        return '';
      case 'postalCode':
        if (value && !isPostal(value)) return '邮编格式不正确';
        return '';
      case 'linkedin':
      case 'twitter':
      case 'website':
        if (value && !isURL(value)) return 'URL格式不正确';
        return '';
      default:
        return '';
    }
  }, []);

  // 防抖验证 - 避免输入时频繁验证
  const debouncedValidate = useDebounce((name: string, value: string) => {
    if (touched.has(name)) {
      const error = validateField(name, value);
      setErrors(prev => ({ ...prev, [name]: error }));
    }
  }, 300);

  const handleChange = useCallback((name: string, value: string) => {
    setValues(prev => ({ ...prev, [name]: value }));
    debouncedValidate(name, value);
  }, [debouncedValidate]);

  const handleBlur = useCallback((name: string, value: string) => {
    setTouched(prev => new Set(prev).add(name));
    const error = validateField(name, value);
    setErrors(prev => ({ ...prev, [name]: error }));
  }, [validateField]);

  // 验证所有字段
  const validateAll = useCallback((): boolean => {
    const fieldsToValidate = ['fullName', 'email', 'phone', 'postalCode', 'linkedin', 'twitter', 'website'];
    const newErrors: Record<string, string> = {};
    
    fieldsToValidate.forEach(field => {
      const error = validateField(field, values[field as keyof Profile]);
      if (error) newErrors[field] = error;
    });

    setErrors(newErrors);
    setTouched(new Set(fieldsToValidate));
    return Object.keys(newErrors).length === 0;
  }, [values, validateField]);

  // 保存处理
  const handleSave = useCallback(async () => {
    if (!validateAll()) {
      setSaveStatus('error');
      setTimeout(() => setSaveStatus('idle'), 3000);
      return;
    }

    setIsSaving(true);
    setSaveStatus('idle');

    try {
      const avatar = await getAvatarForSave();
      const dataToSave = { ...values, avatar };
      
      await onSave(dataToSave);
      lastSavedRef.current = dataToSave;
      setSaveStatus('success');
      setTimeout(() => setSaveStatus('idle'), 3000);
    } catch (e: any) {
      setSaveStatus('error');
    } finally {
      setIsSaving(false);
    }
  }, [values, validateAll, getAvatarForSave, onSave]);

  // 自动保存（可选）
  const autoSave = useDebounce(() => {
    if (hasChanges && !isSaving && Object.keys(errors).length === 0) {
      handleSave();
    }
  }, 5000);

  useEffect(() => {
    autoSave();
  }, [values, preview, autoSave]);

  // 恢复初始值
  const handleReset = useCallback(() => {
    setValues(initialRef.current);
    resetAvatar(initialRef.current.avatar);
    setErrors({});
    setTouched(new Set());
    setSaveStatus('idle');
  }, [resetAvatar]);

  // 清空
  const handleClear = useCallback(() => {
    const emptyProfile: Profile = {
      id: initialRef.current.id,
      fullName: '',
      email: '',
      phone: '',
      dob: '',
      gender: undefined,
      street: '',
      city: '',
      state: '',
      postalCode: '',
      avatar: '',
      title: initialRef.current.title,
      verified: initialRef.current.verified,
      premium: initialRef.current.premium,
    };
    setValues(emptyProfile);
    resetAvatar('');
    setErrors({});
    setTouched(new Set());
  }, [resetAvatar]);

  // 头像上传
  const handleAvatarUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const error = handleFileSelect(file);
    if (error) {
      setSaveStatus('error');
      setTimeout(() => setSaveStatus('idle'), 3000);
    }
  }, [handleFileSelect]);

  // 状态指示器
  const StatusIndicator = () => {
    if (isSaving) return <span className="pi-status saving"><Save size={14} /> 保存中...</span>;
    if (saveStatus === 'success') return <span className="pi-status success"><Check size={14} /> 已保存</span>;
    if (saveStatus === 'error') return <span className="pi-status error"><AlertCircle size={14} /> 保存失败</span>;
    if (hasChanges) return <span className="pi-status unsaved">未保存</span>;
    return <span className="pi-status saved">已同步</span>;
  };

  return (
    <section className="pi-editor" aria-label="Edit Information">
      <div className="pi-editor-card">
        <div className="pi-editor-header">
          <h2 className="pi-editor-title">编辑信息</h2>
          <StatusIndicator />
        </div>

        <div className="pi-grid">
          <div className="pi-col">
            <h3 className="pi-section-title">基本信息</h3>
            
            <FormField
              label="用户名"
              name="fullName"
              value={values.fullName || ''}
              error={errors.fullName}
              required
              placeholder="请输入用户名"
              onChange={handleChange}
              onBlur={handleBlur}
            />

            <FormField
              label="出生日期"
              name="dob"
              type="date"
              value={values.dob || ''}
              onChange={handleChange}
              onBlur={handleBlur}
            />

            <div className="pi-form-group">
              <label className="pi-label">性别</label>
              <select
                value={values.gender || ''}
                onChange={(e) => handleChange('gender', e.target.value)}
                className="pi-input"
              >
                <option value="">请选择</option>
                <option value="male">男性</option>
                <option value="female">女性</option>
                <option value="other">其他</option>
              </select>
            </div>

            <hr className="pi-divider" />

            <h3 className="pi-section-title">联系信息</h3>

            <FormField
              label="邮箱"
              name="email"
              type="email"
              value={values.email || ''}
              error={errors.email}
              required
              placeholder="请输入邮箱"
              onChange={handleChange}
              onBlur={handleBlur}
            />

            <FormField
              label="电话"
              name="phone"
              type="tel"
              value={values.phone || ''}
              error={errors.phone}
              placeholder="请输入电话号码"
              onChange={handleChange}
              onBlur={handleBlur}
            />
          </div>

          <div className="pi-col">
            <h3 className="pi-section-title">地址信息</h3>

            <FormField
              label="街道地址"
              name="street"
              value={values.street || ''}
              placeholder="请输入街道地址"
              onChange={handleChange}
              onBlur={handleBlur}
            />

            <FormField
              label="城市"
              name="city"
              value={values.city || ''}
              placeholder="请输入城市"
              onChange={handleChange}
              onBlur={handleBlur}
            />

            <FormField
              label="省份/州"
              name="state"
              value={values.state || ''}
              placeholder="请输入省份"
              onChange={handleChange}
              onBlur={handleBlur}
            />

            <FormField
              label="邮编"
              name="postalCode"
              value={values.postalCode || ''}
              error={errors.postalCode}
              placeholder="请输入邮编"
              onChange={handleChange}
              onBlur={handleBlur}
            />
          </div>
        </div>

        <hr className="pi-divider" />

        <div className="pi-avatar-uploader">
          <h3 className="pi-section-title">头像</h3>
          <div className="pi-avatar-preview">
            {preview ? (
              <img src={preview} alt="preview" className="pi-avatar-img" />
            ) : (
              <div className="pi-avatar-placeholder">
                <Upload size={32} />
                <p>点击或拖拽上传头像</p>
              </div>
            )}
          </div>
          <label className="pi-upload-label">
            <input
              type="file"
              accept="image/*"
              onChange={handleAvatarUpload}
              style={{ display: 'none' }}
            />
            <span className="pi-upload-btn">选择图片</span>
          </label>
          <p className="pi-upload-hint">最大 3MB，支持 JPG/PNG/WebP</p>
        </div>
        
        <div className="pi-avatar-actions">
          {preview && (
            <button
              type="button"
              className="pi-btn pi-btn-secondary"
              onClick={() => resetAvatar(initialRef.current.avatar)}
            >
              恢复初始头像
            </button>
          )}
          {preview && (
            <button
              type="button"
              className="pi-btn pi-btn-danger"
              onClick={() => resetAvatar('')}
            >
              清除头像
            </button>
          )}
        </div>

        <div className="pi-actions">
          <button
            onClick={handleSave}
            disabled={!hasChanges || isSaving}
            className="pi-btn pi-btn-primary"
          >
            {isSaving ? '保存中...' : '保存变更'}
          </button>
          
          <button
            onClick={handleReset}
            className="pi-btn pi-btn-secondary"
          >
            <RotateCcw size={16} />
            恢复初始值
          </button>
          
          <button
            onClick={handleClear}
            className="pi-btn pi-btn-danger"
          >
            <Trash2 size={16} />
            清空
          </button>
        </div>
      </div>

      <style>{`
        .pi-editor-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 18px;
        }
        
        .pi-status {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 13px;
          font-weight: 600;
          padding: 4px 10px;
          border-radius: 20px;
        }
        
        .pi-status.saving { color: #b45309; background: #fffbeb; }
        .pi-status.success { color: #047857; background: #ecfdf5; }
        .pi-status.error { color: #dc2626; background: #fef2f2; }
        .pi-status.unsaved { color: #6b7280; background: #f3f4f6; }
        .pi-status.saved { color: #047857; background: #ecfdf5; }
        
        .pi-required { color: #dc2626; margin-left: 2px; }
        
        .pi-avatar-actions {
          display: flex;
          gap: 8px;
          margin-top: 12px;
        }
        
        .pi-avatar-actions .pi-btn {
          width: auto;
          padding: 8px 12px;
          font-size: 13px;
        }
        
        .pi-btn-secondary {
          background: #f3f4f6;
          color: #374151;
          border: 1px solid #e5e7eb;
        }
        
        .pi-btn-secondary:hover {
          background: #e5e7eb;
        }
      `}</style>
    </section>
  );
};

export default memo(EditInformationForm);
