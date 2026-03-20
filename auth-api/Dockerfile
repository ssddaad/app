# ============================================
# 多阶段构建 Dockerfile
# 
# 阶段 1: 构建阶段 - 编译 TypeScript
# 阶段 2: 生产阶段 - 运行编译后的代码
# ============================================

# --------------------------------------------
# 阶段 1: 构建阶段
# --------------------------------------------
FROM node:18-alpine AS builder

# 设置工作目录
WORKDIR /app

# 安装构建依赖
RUN apk add --no-cache python3 make g++

# 复制依赖文件
COPY package*.json ./
COPY tsconfig.json ./

# 安装所有依赖（包括开发依赖）
RUN npm ci

# 复制源代码
COPY src ./src

# 编译 TypeScript
RUN npm run build

# --------------------------------------------
# 阶段 2: 生产阶段
# --------------------------------------------
FROM node:18-alpine AS production

# 安装生产环境需要的系统依赖
# - dumb-init: 用于正确处理信号
# - ca-certificates: 用于 HTTPS 请求
RUN apk add --no-cache dumb-init ca-certificates

# 创建非 root 用户
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

# 设置工作目录
WORKDIR /app

# 复制依赖文件
COPY package*.json ./

# 仅安装生产依赖
RUN npm ci --only=production && npm cache clean --force

# 从构建阶段复制编译后的代码
COPY --from=builder --chown=nodejs:nodejs /app/dist ./dist

# 创建日志目录并设置权限
RUN mkdir -p logs && chown -R nodejs:nodejs logs

# 切换到非 root 用户
USER nodejs

# 暴露端口
EXPOSE 3000

# 健康检查
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD node -e "require('http').get('http://localhost:3000/health', (r) => r.statusCode === 200 ? process.exit(0) : process.exit(1))"

# 使用 dumb-init 作为 PID 1，正确处理信号
ENTRYPOINT ["dumb-init", "--"]

# 启动命令
CMD ["node", "dist/server.js"]
