# 生产部署全过程

本指南以一台 **Linux 服务器**（Ubuntu 22.04）+ **Nginx** 为目标，前端静态托管，后端 Docker 容器化运行。

---

## 前提条件

| 需要 | 说明 |
|------|------|
| 一台服务器 | 1核2G 起，推荐阿里云/腾讯云轻量应用服务器 |
| 一个域名 | 需解析两个子域：前端 `www.your-domain.com`，后端 `api.your-domain.com` |
| 本地已安装 Node.js 18+ | 用于构建前端 |
| 服务器已安装 Docker | 见下方安装命令 |

---

## 第一步：构建前端（本地执行）

**1. 修改生产环境变量**

编辑项目根目录的 `.env.production`，将 API 地址改为你的真实域名：

```env
VITE_API_BASE_URL=https://api.your-domain.com/api
VITE_SILICONFLOW_API_KEY=sk-rlgmvtzxnrdvxkfbmqowcuzpzrftihnsmfrindbnmskcepxw
VITE_SILICONFLOW_MODEL=ft:LoRA/Qwen/Qwen2.5-7B-Instruct:d5rp7rmcnncc738k5sq0:breastcancer:oclicfelnbkxecoruzqr-ckpt_step_231
```

**2. 构建**

```bash
npm run build
```

构建产物在 `dist/` 目录，后续上传到服务器。

---

## 第二步：服务器初始化（服务器上执行）

**安装 Docker**

```bash
curl -fsSL https://get.docker.com | sh
sudo usermod -aG docker $USER
newgrp docker
docker --version
```

**安装 Nginx**

```bash
sudo apt update
sudo apt install nginx certbot python3-certbot-nginx -y
```

---

## 第三步：部署后端

**上传代码（本地执行）**

```bash
scp -r ./auth-api root@your-server-ip:/opt/auth-api
```

**配置生产环境变量（服务器上执行）**

```bash
cd /opt/auth-api

# 生成安全密钥（分别执行三次，记下输出）
openssl rand -hex 64   # → JWT_SECRET
openssl rand -hex 64   # → JWT_REFRESH_SECRET
openssl rand -hex 32   # → REDIS_PASSWORD
```

创建 `/opt/auth-api/.env` 文件，填入以下内容（替换所有占位符）：

```env
NODE_ENV=production
PORT=3000

DATABASE_URL=postgresql://authuser:替换为强密码@postgres:5432/auth_database
DB_HOST=postgres
DB_PORT=5432
DB_NAME=auth_database
DB_USER=authuser
DB_PASSWORD=替换为强密码

JWT_SECRET=替换为第一个openssl输出
JWT_EXPIRATION=1h
JWT_REFRESH_SECRET=替换为第二个openssl输出
JWT_REFRESH_EXPIRATION=7d

BCRYPT_SALT_ROUNDS=12

REDIS_HOST=redis
REDIS_PORT=6379
REDIS_PASSWORD=替换为第三个openssl输出

TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=your_auth_token
TWILIO_PHONE_NUMBER=+86你的号码

RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

CORS_ORIGIN=https://www.your-domain.com
```

> ⚠️ 所有占位符必须填写真实值，否则后端启动时会报错崩溃。
> ⚠️ `.env` 文件绝不能提交到 Git，确认 `.gitignore` 中已包含 `.env`。

**启动后端容器**

```bash
cd /opt/auth-api
docker compose up -d --build

# 等待约 30 秒，查看启动状态
docker compose ps                   # 三个容器全部 healthy
docker compose logs -f auth-api     # 看到 "Server is running on port 3000" 表示成功
```

**验证后端**

```bash
curl http://localhost:3000/health
# 预期：{"success":true,"message":"服务正常运行",...}
```

---

## 第四步：部署前端静态文件

**上传 dist 目录（本地执行）**

```bash
scp -r ./dist root@your-server-ip:/var/www/rcax
```

---

## 第五步：配置 Nginx

**创建前端站点配置（服务器上执行）**

```bash
sudo nano /etc/nginx/sites-available/rcax-frontend
```

写入以下内容：

```nginx
server {
    listen 80;
    server_name www.your-domain.com your-domain.com;

    root /var/www/rcax;
    index index.html;

    # SPA 路由支持（React Router）
    location / {
        try_files $uri $uri/ /index.html;
    }

    # 静态资源长期缓存
    location /assets/ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

**创建后端反向代理配置**

```bash
sudo nano /etc/nginx/sites-available/rcax-api
```

写入以下内容：

```nginx
server {
    listen 80;
    server_name api.your-domain.com;

    location / {
        proxy_pass         http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header   Host $host;
        proxy_set_header   X-Real-IP $remote_addr;
        proxy_set_header   X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header   X-Forwarded-Proto $scheme;
        proxy_read_timeout 60s;
    }
}
```

**启用站点**

```bash
sudo ln -s /etc/nginx/sites-available/rcax-frontend /etc/nginx/sites-enabled/
sudo ln -s /etc/nginx/sites-available/rcax-api      /etc/nginx/sites-enabled/

sudo nginx -t              # 检查配置语法
sudo systemctl reload nginx
```

---

## 第六步：申请 HTTPS 证书

> 确保域名 DNS 已解析到服务器 IP 后再执行。

```bash
sudo certbot --nginx -d www.your-domain.com -d your-domain.com
sudo certbot --nginx -d api.your-domain.com

# 验证自动续期
sudo certbot renew --dry-run
```

Certbot 会自动修改 Nginx 配置，添加 SSL 并强制 HTTP → HTTPS 跳转。

---

## 第七步：配置防火墙

```bash
sudo ufw allow 22     # SSH
sudo ufw allow 80     # HTTP
sudo ufw allow 443    # HTTPS
sudo ufw enable
sudo ufw status
```

> 注意：3000（后端）、5432（PostgreSQL）、6379（Redis）端口**不需要**对外开放。

---

## 验证部署成功

```bash
# 后端健康检查
curl https://api.your-domain.com/health

# 前端：浏览器打开
# https://www.your-domain.com
```

---

## 常用维护命令

```bash
# 查看后端实时日志
docker compose -f /opt/auth-api/docker-compose.yml logs -f auth-api

# 更新后端代码后重新部署
cd /opt/auth-api
git pull
docker compose up -d --build auth-api

# 更新前端（本地重新 build 后上传）
npm run build
scp -r ./dist root@your-server-ip:/var/www/rcax

# 重启 Nginx
sudo systemctl reload nginx

# 查看所有容器状态
docker compose -f /opt/auth-api/docker-compose.yml ps

# 进入数据库调试
docker exec -it auth-postgres psql -U authuser -d auth_database
```

---

## 部署检查清单

- [ ] `docker compose ps` 三个容器全部 `healthy`
- [ ] `curl https://api.your-domain.com/health` 返回 200
- [ ] 浏览器访问 `https://www.your-domain.com` 正常显示
- [ ] HTTPS 证书有效（绿色锁图标）
- [ ] 登录 / 注册功能正常（前后端联调通过）
- [ ] `.env` 文件未提交到 Git（`git status` 确认）
- [ ] `JWT_SECRET` 和 `JWT_REFRESH_SECRET` 不是默认开发值
- [ ] 数据库密码不是弱密码
- [ ] `CORS_ORIGIN` 填写了正确的前端域名
- [ ] 防火墙已启用，只开放 22 / 80 / 443
