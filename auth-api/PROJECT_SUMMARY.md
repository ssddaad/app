# Auth API 项目摘要

## 项目概述

这是一个基于 Node.js + TypeScript 的完整用户认证后端 API 服务，提供了用户注册、登录、验证码、用户信息管理等核心功能。

## 技术栈

- **运行时**: Node.js 18+
- **语言**: TypeScript 5.3+
- **Web 框架**: Express.js 4.18+
- **数据库**: PostgreSQL 15+
- **ORM**: Sequelize 6.35+
- **缓存**: Redis 7+
- **认证**: JWT (JSON Web Tokens)
- **密码哈希**: bcrypt
- **短信服务**: Twilio
- **日志**: Winston
- **测试**: Jest + Supertest
- **容器化**: Docker + Docker Compose

## 项目结构

```
auth-api/
├── src/                          # 源代码
│   ├── config/                   # 配置文件
│   │   ├── config.ts            # 应用配置
│   │   ├── database.ts          # 数据库配置
│   │   ├── redis.ts             # Redis 配置
│   │   └── index.ts             # 配置导出
│   ├── controllers/              # 控制器
│   │   ├── auth.controller.ts   # 认证控制器
│   │   └── index.ts             # 控制器导出
│   ├── middleware/               # 中间件
│   │   ├── auth.middleware.ts   # 认证中间件
│   │   ├── error.middleware.ts  # 错误处理中间件
│   │   └── index.ts             # 中间件导出
│   ├── models/                   # 数据模型
│   │   ├── user.model.ts        # 用户模型
│   │   └── index.ts             # 模型导出
│   ├── routes/                   # 路由
│   │   ├── auth.routes.ts       # 认证路由
│   │   └── index.ts             # 路由导出
│   ├── services/                 # 服务层
│   │   ├── sms.service.ts       # 短信服务
│   │   └── index.ts             # 服务导出
│   ├── types/                    # 类型定义
│   │   ├── express.d.ts         # Express 类型扩展
│   │   └── index.ts             # 类型导出
│   ├── utils/                    # 工具函数
│   │   ├── auth.utils.ts        # 认证工具
│   │   ├── logger.ts            # 日志工具
│   │   └── index.ts             # 工具导出
│   ├── app.ts                    # Express 应用
│   └── server.ts                 # 服务器入口
├── tests/                        # 测试文件
│   ├── unit/                     # 单元测试
│   │   └── auth.utils.test.ts
│   ├── integration/              # 集成测试
│   │   └── auth.routes.test.ts
│   └── setup.ts                  # 测试设置
├── docs/                         # 文档
│   └── swagger.yaml              # API 文档
├── init-scripts/                 # 数据库初始化
│   └── 01-init.sql
├── .env.example                  # 环境变量示例
├── .env.test                     # 测试环境变量
├── .eslintrc.js                  # ESLint 配置
├── .gitignore                    # Git 忽略文件
├── Dockerfile                    # 生产 Docker 配置
├── Dockerfile.dev                # 开发 Docker 配置
├── docker-compose.yml            # 生产 Docker Compose
├── docker-compose.dev.yml        # 开发 Docker Compose
├── jest.config.js                # Jest 配置
├── Makefile                      # 常用命令
├── package.json                  # 项目依赖
├── tsconfig.json                 # TypeScript 配置
├── README.md                     # 项目说明
└── LICENSE                       # 许可证
```

## API 端点

### 公开端点

| 方法 | 端点 | 描述 |
|------|------|------|
| GET | /health | 健康检查 |
| POST | /api/auth/register | 用户注册 |
| POST | /api/auth/login | 用户登录 |
| POST | /api/auth/send-code | 发送验证码 |
| POST | /api/auth/refresh | 刷新令牌 |

### 需要认证的端点

| 方法 | 端点 | 描述 |
|------|------|------|
| GET | /api/auth/user | 获取用户信息 |
| PUT | /api/auth/user | 更新用户信息 |
| POST | /api/auth/logout | 用户登出 |
| POST | /api/auth/change-password | 修改密码 |

## 核心功能

### 1. 用户注册
- 手机号验证（中国大陆格式）
- 密码强度验证
- 昵称唯一性检查
- bcrypt 密码哈希

### 2. 用户登录
- 用户名/密码登录
- 手机号/验证码登录
- JWT 令牌生成
- 刷新令牌机制

### 3. 验证码
- 6 位数字验证码
- 5 分钟有效期
- 60 秒发送频率限制
- Redis 存储

### 4. 安全特性
- JWT 认证
- 请求速率限制
- Helmet 安全头
- CORS 跨域保护
- HPP 参数污染防护
- 输入验证

### 5. 日志记录
- Winston 日志库
- 结构化日志格式
- 请求追踪
- 性能日志
- 安全日志
- 审计日志

## 快速开始

### 本地开发

```bash
# 1. 安装依赖
npm install

# 2. 配置环境变量
cp .env.example .env
# 编辑 .env 文件

# 3. 启动开发服务器
npm run dev
```

### Docker 部署

```bash
# 开发环境
docker-compose -f docker-compose.dev.yml up -d

# 生产环境
docker-compose up -d
```

## 测试

```bash
# 运行测试
npm test

# 覆盖率报告
npm run test:coverage

# 监视模式
npm run test:watch
```

## 常用命令

```bash
# 开发
make dev          # 启动开发服务器
make install      # 安装依赖
make build        # 编译项目

# 测试
make test         # 运行测试
make test-coverage # 覆盖率报告

# Docker
make docker-up    # 启动 Docker
make docker-down  # 停止 Docker
make docker-logs  # 查看日志

# 代码质量
make lint         # ESLint 检查
make lint-fix     # 自动修复

# 其他
make clean        # 清理构建文件
make help         # 显示帮助
```

## 环境变量

### 必需配置

- `DATABASE_URL` - 数据库连接 URL
- `JWT_SECRET` - JWT 密钥
- `REDIS_HOST` - Redis 主机地址

### 可选配置

- `PORT` - 服务器端口（默认 3000）
- `NODE_ENV` - 运行环境（默认 development）
- `BCRYPT_SALT_ROUNDS` - bcrypt 盐值轮数（默认 12）
- `JWT_EXPIRATION` - JWT 过期时间（默认 1h）
- `RATE_LIMIT_MAX_REQUESTS` - 速率限制（默认 100）

## 安全建议

1. **生产环境**
   - 使用强密钥（JWT_SECRET、JWT_REFRESH_SECRET）
   - 启用 HTTPS
   - 配置数据库 SSL
   - 设置防火墙规则

2. **密码策略**
   - 至少 8 个字符
   - 包含大小写字母
   - 包含数字
   - 包含特殊字符

3. **速率限制**
   - 登录端点：15 分钟内最多 10 次
   - 通用端点：15 分钟内最多 100 次

## 扩展建议

1. **功能扩展**
   - 邮箱验证
   - 第三方登录（微信、QQ、GitHub）
   - 多因素认证（MFA）
   - 密码重置
   - 用户角色权限

2. **性能优化**
   - 数据库连接池优化
   - Redis 集群
   - API 缓存
   - 数据库索引优化

3. **监控告警**
   - 应用性能监控（APM）
   - 错误追踪
   - 日志聚合
   - 告警通知

## 许可证

MIT License
