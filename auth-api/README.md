# Auth API - 用户认证后端服务

一个功能完善的用户认证后端 API 服务，基于 Node.js + TypeScript + Express + PostgreSQL + Redis 构建。

## 功能特性

- 用户注册/登录（支持用户名/密码和手机号/验证码两种方式）
- JWT 身份认证与令牌刷新
- 短信验证码发送（支持 Twilio）
- 用户信息管理
- 密码修改
- 请求速率限制
- 完整的错误处理和日志记录
- 全面的单元测试和集成测试
- Docker 容器化支持

## 技术栈

| 技术 | 用途 |
|------|------|
| Node.js 18+ | 运行时环境 |
| TypeScript | 类型安全的 JavaScript |
| Express.js | Web 框架 |
| PostgreSQL | 关系型数据库 |
| Sequelize ORM | 数据库 ORM |
| Redis | 缓存和会话存储 |
| JWT | 身份认证 |
| bcrypt | 密码哈希 |
| Winston | 日志记录 |
| Twilio | 短信服务 |
| Jest | 测试框架 |
| Docker | 容器化 |

## 快速开始

### 环境要求

- Node.js 18+
- PostgreSQL 15+
- Redis 7+
- npm 或 yarn

### 本地开发

1. 克隆项目并安装依赖

```bash
cd auth-api
npm install
```

2. 配置环境变量

```bash
cp .env.example .env
# 编辑 .env 文件，配置数据库和其他服务
```

3. 启动开发服务器

```bash
npm run dev
```

服务将在 http://localhost:3000 启动。

### Docker 部署

#### 使用 Docker Compose（推荐）

```bash
# 开发环境
docker-compose -f docker-compose.dev.yml up -d

# 生产环境
docker-compose up -d
```

#### 手动构建 Docker 镜像

```bash
# 构建镜像
docker build -t auth-api .

# 运行容器
docker run -p 3000:3000 --env-file .env auth-api
```

## API 文档

启动服务后，访问 http://localhost:3000/api-docs 查看 Swagger API 文档。

### 主要 API 端点

| 方法 | 端点 | 描述 | 认证 |
|------|------|------|------|
| POST | /api/auth/register | 用户注册 | 否 |
| POST | /api/auth/login | 用户登录 | 否 |
| POST | /api/auth/send-code | 发送验证码 | 否 |
| POST | /api/auth/refresh | 刷新令牌 | 否 |
| POST | /api/auth/logout | 用户登出 | 是 |
| GET | /api/auth/user | 获取用户信息 | 是 |
| PUT | /api/auth/user | 更新用户信息 | 是 |
| POST | /api/auth/change-password | 修改密码 | 是 |
| GET | /health | 健康检查 | 否 |

### 请求示例

#### 用户注册

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "phone": "13800138000",
    "password": "Password123!",
    "nickname": "张三"
  }'
```

#### 用户登录（用户名/密码）

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "张三",
    "password": "Password123!"
  }'
```

#### 用户登录（手机号/验证码）

```bash
# 1. 发送验证码
curl -X POST http://localhost:3000/api/auth/send-code \
  -H "Content-Type: application/json" \
  -d '{
    "phone": "13800138000",
    "scene": "login"
  }'

# 2. 使用验证码登录
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "phone": "13800138000",
    "code": "123456"
  }'
```

#### 获取用户信息

```bash
curl -X GET http://localhost:3000/api/auth/user \
  -H "Authorization: Bearer <your-jwt-token>"
```

## 项目结构

```
auth-api/
├── src/
│   ├── config/          # 配置文件
│   │   ├── config.ts    # 应用配置
│   │   ├── database.ts  # 数据库配置
│   │   └── redis.ts     # Redis 配置
│   ├── controllers/     # 控制器
│   │   └── auth.controller.ts
│   ├── middleware/      # 中间件
│   │   ├── auth.middleware.ts
│   │   └── error.middleware.ts
│   ├── models/          # 数据模型
│   │   └── user.model.ts
│   ├── routes/          # 路由
│   │   └── auth.routes.ts
│   ├── services/        # 服务层
│   │   └── sms.service.ts
│   ├── types/           # 类型定义
│   │   └── express.d.ts
│   ├── utils/           # 工具函数
│   │   ├── auth.utils.ts
│   │   └── logger.ts
│   ├── app.ts           # Express 应用
│   └── server.ts        # 服务器入口
├── tests/               # 测试文件
│   ├── unit/            # 单元测试
│   └── integration/     # 集成测试
├── docs/                # 文档
│   └── swagger.yaml     # API 文档
├── .env.example         # 环境变量示例
├── .gitignore
├── docker-compose.yml   # Docker Compose 配置
├── docker-compose.dev.yml
├── Dockerfile           # Docker 配置
├── Dockerfile.dev
├── jest.config.js       # Jest 配置
├── package.json
├── tsconfig.json        # TypeScript 配置
└── README.md
```

## 环境变量

| 变量名 | 说明 | 默认值 |
|--------|------|--------|
| PORT | 服务器端口 | 3000 |
| NODE_ENV | 运行环境 | development |
| DATABASE_URL | 数据库连接 URL | - |
| DB_HOST | 数据库主机 | localhost |
| DB_PORT | 数据库端口 | 5432 |
| DB_NAME | 数据库名称 | auth_database |
| DB_USER | 数据库用户名 | user |
| DB_PASSWORD | 数据库密码 | password |
| JWT_SECRET | JWT 密钥 | - |
| JWT_EXPIRATION | JWT 过期时间 | 1h |
| JWT_REFRESH_SECRET | JWT 刷新密钥 | - |
| JWT_REFRESH_EXPIRATION | 刷新令牌过期时间 | 7d |
| BCRYPT_SALT_ROUNDS | bcrypt 盐值轮数 | 12 |
| REDIS_HOST | Redis 主机 | localhost |
| REDIS_PORT | Redis 端口 | 6379 |
| REDIS_PASSWORD | Redis 密码 | - |
| TWILIO_ACCOUNT_SID | Twilio 账户 SID | - |
| TWILIO_AUTH_TOKEN | Twilio 认证令牌 | - |
| TWILIO_PHONE_NUMBER | Twilio 电话号码 | - |
| RATE_LIMIT_WINDOW_MS | 速率限制窗口 | 900000 |
| RATE_LIMIT_MAX_REQUESTS | 最大请求数 | 100 |
| CORS_ORIGIN | CORS 允许来源 | * |

## 测试

```bash
# 运行所有测试
npm test

# 运行测试并生成覆盖率报告
npm run test:coverage

# 监视模式运行测试
npm run test:watch
```

## 脚本命令

| 命令 | 说明 |
|------|------|
| `npm run dev` | 开发模式启动（热重载） |
| `npm run build` | 编译 TypeScript |
| `npm start` | 生产模式启动 |
| `npm test` | 运行测试 |
| `npm run test:coverage` | 生成测试覆盖率报告 |
| `npm run lint` | 运行 ESLint |
| `npm run lint:fix` | 自动修复 ESLint 错误 |

## 安全特性

- 密码使用 bcrypt 哈希存储（默认 12 轮）
- JWT 令牌过期机制
- 请求速率限制
- Helmet 安全 HTTP 头
- CORS 跨域保护
- HPP 参数污染防护
- 输入验证和清理
- SQL 注入防护（Sequelize 参数化查询）

## 部署建议

### 生产环境检查清单

- [ ] 修改所有默认密钥和密码
- [ ] 配置 HTTPS
- [ ] 启用数据库 SSL 连接
- [ ] 配置日志收集系统
- [ ] 设置监控和告警
- [ ] 配置备份策略
- [ ] 启用防火墙规则
- [ ] 配置负载均衡

### AWS 部署示例

1. 创建 RDS PostgreSQL 数据库
2. 创建 ElastiCache Redis 集群
3. 创建 ECR 仓库并推送镜像
4. 创建 ECS 集群和服务
5. 配置 Application Load Balancer
6. 设置 CodePipeline CI/CD

## 贡献指南

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/amazing-feature`)
3. 提交更改 (`git commit -m 'Add amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 创建 Pull Request

## 许可证

[MIT](LICENSE)

## 联系方式

如有问题或建议，请提交 Issue 或联系维护者。
