# ============================================================
# 前端 Dockerfile（多阶段构建）
#
# 阶段 1: 构建  — 使用 Node.js 编译 Vite + React 应用
# 阶段 2: 生产  — 使用 Nginx 轻量镜像 serve 静态文件
# ============================================================

# ── 阶段 1: 构建 ──────────────────────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app

# 先复制依赖文件，充分利用 Docker layer 缓存
COPY package*.json ./

RUN npm ci

# 复制源码（排除 node_modules，见 .dockerignore）
COPY . .

# 生产构建（读取 .env.production）
RUN npm run build

# ── 阶段 2: 生产 Nginx ────────────────────────────────────────
FROM nginx:1.27-alpine AS production

# 删除默认配置
RUN rm /etc/nginx/conf.d/default.conf

# 复制自定义 Nginx 配置
COPY nginx.conf /etc/nginx/conf.d/default.conf

# 复制构建产物
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
    CMD wget -qO- http://localhost/ || exit 1

CMD ["nginx", "-g", "daemon off;"]
