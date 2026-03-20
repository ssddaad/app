/**
 * 用户模型定义
 * 
 * 该模型定义用户表结构，包含：
 * - 基本信息：手机号、昵称
 * - 安全信息：密码哈希
 * - 时间戳：创建时间、更新时间
 * 
 * 使用 UUID 作为主键，支持软删除
 */

import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';

/**
 * 用户属性接口
 */
export interface UserAttributes {
  id: string;
  phone: string;
  nickname: string;
  password_hash: string;
  avatar_url?: string;
  status: 'active' | 'inactive' | 'suspended';
  last_login_at?: Date;
  created_at: Date;
  updated_at: Date;
  deleted_at?: Date | null;
}

/**
 * 用户创建属性接口（可选字段）
 */
export interface UserCreationAttributes 
  extends Optional<UserAttributes, 'id' | 'status' | 'avatar_url' | 'last_login_at' | 'created_at' | 'updated_at' | 'deleted_at'> {}

/**
 * 用户模型类
 * 
 * 继承 Sequelize Model，提供类型安全的数据库操作
 */
class User extends Model<UserAttributes, UserCreationAttributes> 
  implements UserAttributes {
  
  // 声明模型属性
  public id!: string;
  public phone!: string;
  public nickname!: string;
  public password_hash!: string;
  public avatar_url?: string;
  public status!: 'active' | 'inactive' | 'suspended';
  public last_login_at?: Date;
  
  // 时间戳
  public readonly created_at!: Date;
  public readonly updated_at!: Date;
  public readonly deleted_at?: Date | null;
  
  /**
   * 获取用户公开信息（隐藏敏感字段）
   */
  public toPublicJSON(): object {
    return {
      id: this.id,
      phone: this.maskPhone(),
      nickname: this.nickname,
      avatar_url: this.avatar_url,
      status: this.status,
      created_at: this.created_at,
    };
  }
  
  /**
   * 获取完整用户信息（用于内部处理）
   */
  public toFullJSON(): object {
    return {
      id: this.id,
      phone: this.phone,
      nickname: this.nickname,
      avatar_url: this.avatar_url,
      status: this.status,
      last_login_at: this.last_login_at,
      created_at: this.created_at,
      updated_at: this.updated_at,
    };
  }
  
  /**
   * 隐藏手机号中间四位
   */
  private maskPhone(): string {
    if (!this.phone || this.phone.length < 7) {
      return this.phone;
    }
    return this.phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2');
  }
}

/**
 * 初始化用户模型
 * 
 * 定义表结构和约束条件
 */
User.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      comment: '用户唯一标识符（UUID）',
    },
    
    phone: {
      type: DataTypes.STRING(20),
      allowNull: false,
      unique: {
        name: 'unique_phone',
        msg: '该手机号已被注册',
      },
      validate: {
        is: {
          args: [/^1[3-9]\d{9}$/],
          msg: '请输入有效的中国大陆手机号',
        },
        notEmpty: {
          msg: '手机号不能为空',
        },
      },
      comment: '用户手机号，唯一标识',
    },
    
    nickname: {
      type: DataTypes.STRING(50),
      allowNull: false,
      validate: {
        len: {
          args: [2, 50],
          msg: '昵称长度必须在 2-50 个字符之间',
        },
        notEmpty: {
          msg: '昵称不能为空',
        },
      },
      comment: '用户昵称',
    },
    
    password_hash: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: {
        notEmpty: {
          msg: '密码哈希不能为空',
        },
      },
      comment: '密码哈希值（bcrypt）',
    },
    
    avatar_url: {
      type: DataTypes.STRING(500),
      allowNull: true,
      validate: {
        isUrl: {
          msg: '头像 URL 格式不正确',
        },
      },
      comment: '用户头像 URL',
    },
    
    status: {
      type: DataTypes.ENUM('active', 'inactive', 'suspended'),
      defaultValue: 'active',
      allowNull: false,
      comment: '用户状态：active-正常, inactive-未激活, suspended-已封禁',
    },
    
    last_login_at: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: '最后登录时间',
    },
    
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      comment: '创建时间',
    },
    
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      comment: '更新时间',
    },
    
    deleted_at: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: '删除时间（软删除）',
    },
  },
  {
    sequelize,
    tableName: 'users',
    modelName: 'User',
    timestamps: true,           // 启用 created_at 和 updated_at
    paranoid: true,             // 启用软删除
    underscored: true,          // 使用下划线命名
    freezeTableName: true,      // 禁用表名自动复数化
    
    // 索引配置
    indexes: [
      {
        unique: true,
        fields: ['phone'],
        name: 'idx_users_phone_unique',
      },
      {
        fields: ['nickname'],
        name: 'idx_users_nickname',
      },
      {
        fields: ['status'],
        name: 'idx_users_status',
      },
      {
        fields: ['created_at'],
        name: 'idx_users_created_at',
      },
    ],
    
    // 钩子配置
    hooks: {
      // 创建前验证
      beforeCreate: (user) => {
        // 确保手机号格式统一
        user.phone = user.phone.trim();
        user.nickname = user.nickname.trim();
      },
      
      // 更新前验证
      beforeUpdate: (user) => {
        if (user.changed('phone')) {
          user.phone = user.phone.trim();
        }
        if (user.changed('nickname')) {
          user.nickname = user.nickname.trim();
        }
      },
    },
  }
);

// ─── 用户模型静态方法（类型安全地挂载到 User 类） ─────────────────────────────

/**
 * 扩展 User 类的静态方法类型
 * 通过 interface 合并让 TypeScript 识别动态挂载的静态方法
 */
interface UserStatic {
  findByPhone(phone: string): Promise<User | null>;
  findByNickname(nickname: string): Promise<User | null>;
  isPhoneRegistered(phone: string): Promise<boolean>;
  isNicknameTaken(nickname: string): Promise<boolean>;
  updateLastLogin(userId: string): Promise<void>;
}

// 将静态方法类型与 User 模型合并，方便在控制器中使用
const UserModel = User as typeof User & UserStatic;

UserModel.findByPhone = async function (phone: string): Promise<User | null> {
  return this.findOne({ where: { phone }, paranoid: true });
};

UserModel.findByNickname = async function (nickname: string): Promise<User | null> {
  return this.findOne({ where: { nickname }, paranoid: true });
};

UserModel.isPhoneRegistered = async function (phone: string): Promise<boolean> {
  const count = await this.count({ where: { phone }, paranoid: true });
  return count > 0;
};

UserModel.isNicknameTaken = async function (nickname: string): Promise<boolean> {
  const count = await this.count({ where: { nickname }, paranoid: true });
  return count > 0;
};

UserModel.updateLastLogin = async function (userId: string): Promise<void> {
  await this.update({ last_login_at: new Date() }, { where: { id: userId } });
};

export type { User };
export default UserModel;
