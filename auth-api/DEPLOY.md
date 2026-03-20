# Auth API 生产部署指南

> 适用环境：Linux 服务器（Ubuntu 20.04 / 22.04 推荐），已安装 Docker 和 Docker Compose。

---

## 一、代码审查结论

经过完整代码审查，后端代码已具备生产就绪条件：

| 检查项 | 状态 | 说明 |
|--------|------|------|
| 配置验证 | ✅ | 生产环境缺少必填变量时启动即崩溃 |
| JWT 密钥安全 | ✅ | 生产环境强制注入，长度 ≥32 位，拒绝默认值 |
| 验证码随机性 | ✅ | 使用 `crypto.randomInt`（CSPRNG）代替 `Math.random` |
| 密码哈希 | ✅ | bcrypt，生产环境最低 12 轮 |
| 请求头日志 | ✅ | 生产环境不记录 Authorization / Cookie |
| CORS | ✅ | 生产严格白名单，禁止通配符 `*` |
| 速率限制 | ✅ | 全局 100次/15分钟，认证端点 10次/3分钟 |
| 登录暴力破解防护 | ✅ | 密码连续失败 5 次锁定 30 分钟 |
| 数据库自动同步 | ✅ | 生产环境已禁用，必须用迁移脚本 |
| 信任代理 | ✅ | Nginx 后能正确获取真实客户端 IP |
| Docker 安全 | ✅ | 非 root 用户运行，内存/CPU 限制，不对外暴露 DB 端口 |
| 优雅关闭 | ✅ | SIGTERM/SIGINT 信号正确处理 |
| HSTS | ✅ | 生产环境强制 HTTPS 响应头（需配合 HTTPS） |
| Twilio 验证 | ✅ | 生产环境凭据缺失时启动报错 |
| 验证码明文 | ✅ | 生产环境响应中不返回验证码 |

---

## 二、服务器前置要求

```bash
# 1. 安装 Docker（Ubuntu）
curl -fsSL https://get.docker.com | sh
sudo usermod -aG docker $USER
newgrp docker

# 2. 验证安装
docker --version        # Docker 24.x 以上
docker compose version  # v2.x 以上
```

---

## 三、上传代码到服务器

```bash
# 方式 A：使用 scp 上传整个 auth-api 目录
scp -r ./auth-api user@your-server-ip:/opt/auth-api

# 方式 B：使用 Git（推荐）
ssh user@your-server-ip
mkdir -p /opt/auth-api && cd /opt/auth-api
git clone https://your-repo-url.git .
```

---

## 四、配置环境变量（最重要）

```bash
cd /opt/auth-api

# 从模板复制
cp .env.production.example .env

# 编辑并填写所有 REQUIRED 字段
nano .env
```

### 必须修改的字段

```bash
# 生成强随机密钥（在服务器上执行）
openssl rand -hex 64   # 复制输出 → JWT_SECRET
openssl rand -hex 64   # 再次执行 → JWT_REFRESH_SECRET
openssl rand -hex 32   # 再次执行 → REDIS_PASSWORD
```

`.env` 最终应类似：

```env
NODE_ENV=production
PORT=3000

DATABASE_URL=postgresql://myuser:MyStrongPass123@postgres:5432/auth_database
DB_HOST=postgres
DB_PORT=5432
DB_NAME=auth_database
DB_USER=myuser
DB_PASSWORD=MyStrongPass123

JWT_SECRET=（openssl rand -hex 64 的输出，128个字符）
JWT_EXPIRATION=1h
JWT_REFRESH_SECRET=（另一个 openssl rand -hex 64 的输出）
JWT_REFRESH_EXPIRATION=7d

BCRYPT_SALT_ROUNDS=12

REDIS_HOST=redis
REDIS_PORT=6379
REDIS_PASSWORD=（openssl rand -hex 32 的输出）

TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=+8613800000000

RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# 填写你的前端域名，多个用逗号分隔
CORS_ORIGIN=https://your-frontend-domain.com
```

> ⚠️ **安全须知**：`.env` 文件绝不能提交到 Git，确认 `.gitignore` 中已包含 `.env`。

---

## 五、首次启动

```bash
cd /opt/auth-api

# 构建镜像并启动所有服务（后台运行）
docker compose up -d --build

# 查看启动日志（等待看到 "Server is running on port 3000"）
docker compose logs -f auth-api

# 查看所有容器状态（应全部显示 healthy）
docker compose ps
```

### 预期输出

```
NAME            STATUS
auth-api        Up X minutes (healthy)
auth-postgres   Up X minutes (healthy)
auth-redis      Up X minutes (healthy)
```

### 验证服务正常

```bash
# 健康检查
curl http://localhost:3000/health

# 预期响应
# {"success":true,"message":"服务正常运行","data":{"status":"healthy",...}}
```

---

## 六、配置 Nginx 反向代理（推荐）

如果你有域名并需要 HTTPS，安装 Nginx 并配置反向代理：

```bash
sudo apt install nginx certbot python3-certbot-nginx -y
```

创建站点配置 `/etc/nginx/sites-available/auth-api`：

```nginx
server {
    listen 80;
    server_name api.your-domain.com;

    # 强制跳转 HTTPS
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl;
    server_name api.your-domain.com;

    # SSL 证书（certbot 自动生成）
    ssl_certificate     /etc/letsencrypt/live/api.your-domain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/api.your-domain.com/privkey.pem;

    # 安全 SSL 配置
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;

    # 代理到后端
    location / {
        proxy_pass         http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header   Upgrade $http_upgrade;
        proxy_set_header   Connection 'upgrade';
        proxy_set_header   Host $host;
        proxy_set_header   X-Real-IP $remote_addr;
        proxy_set_header   X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header   X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_read_timeout 60s;
    }
}
```

```bash
# 启用站点
sudo ln -s /etc/nginx/sites-available/auth-api /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx

# 申请免费 SSL 证书（Let's Encrypt）
sudo certbot --nginx -d api.your-domain.com

# 验证自动续期
sudo certbot renew --dry-run
```

---

## 七、数据库迁移（生产环境必须）

生产环境禁用了 Sequelize 自动同步，必须手动初始化数据库表结构：

```bash
# 方式 A：使用项目自带的 init-scripts（首次部署自动执行，Docker 已配置）
# init-scripts/01-init.sql 会在 postgres 容器首次启动时自动执行
# 无需手动操作

# 方式 B：手动执行 SQL
docker exec -it auth-postgres psql -U myuser -d auth_database -f /docker-entrypoint-initdb.d/01-init.sql

# 验证表是否创建成功
docker exec -it auth-postgres psql -U myuser -d auth_database -c "\dt"
```

---

## 八、前端配置

前端项目根目录创建 `.env.production`：

```bash
# app/.env.production
VITE_API_BASE_URL=https://api.your-domain.com/api
```

然后重新构建前端：

```bash
cd /path/to/app   # 前端根目录
npm run build
# 将 dist/ 目录部署到 Nginx 或 CDN
```

---

## 九、常用运维命令

```bash
# 查看实时日志
docker compose logs -f auth-api
docker compose logs -f postgres
docker compose logs -f redis

# 重启单个服务
docker compose restart auth-api

# 更新代码后重新部署
git pull
docker compose up -d --build auth-api

# 停止所有服务
docker compose down

# 停止并清除数据卷（⚠️ 会删除数据库数据！）
docker compose down -v

# 查看容器资源使用
docker stats

# 进入容器调试
docker exec -it auth-api sh
docker exec -it auth-postgres psql -U myuser -d auth_database
docker exec -it auth-redis redis-cli -a your_redis_password

# 查看日志文件（宿主机）
tail -f /opt/auth-api/logs/combined.log
tail -f /opt/auth-api/logs/error.log
```

---

## 十、防火墙配置

```bash
# 只开放必要端口
sudo ufw allow 22    # SSH
sudo ufw allow 80    # HTTP（跳转到 HTTPS）
sudo ufw allow 443   # HTTPS
sudo ufw enable

# 注意：3000、5432、6379 端口不需要对外开放
# Docker 服务之间通过内部网络通信
```

---

## 十一、部署检查清单

部署完成后，逐一确认以下项目：

- [ ] `docker compose ps` 显示所有容器 `healthy`
- [ ] `curl https://api.your-domain.com/health` 返回 200
- [ ] HTTPS 证书有效（浏览器无警告）
- [ ] `.env` 文件不在 Git 仓库中（`git status` 确认）
- [ ] `JWT_SECRET` 和 `JWT_REFRESH_SECRET` 不是默认开发值
- [ ] 数据库密码不是 `password`
- [ ] Redis 已设置密码
- [ ] `CORS_ORIGIN` 填写了正确的前端域名
- [ ] 防火墙已启用，只开放 22/80/443
- [ ] 日志文件正常写入（`/opt/auth-api/logs/`）
- [ ] 前端 `VITE_API_BASE_URL` 指向正确的后端地址
