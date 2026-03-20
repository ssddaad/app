/**
 * 模型统一导出
 * 
 * 集中导出所有数据模型，方便其他模块导入
 */

import User, { UserAttributes, UserCreationAttributes } from './user.model';

export {
  User,
  UserAttributes,
  UserCreationAttributes,
};

// 模型关联配置（如果有）
// 例如：User.hasMany(Post);
// Post.belongsTo(User);

export default {
  User,
};
