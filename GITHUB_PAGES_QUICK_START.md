# GitHub Pages 部署快速参考

## 部署步骤

### 1️⃣ 初始化（仅需一次）

```bash
# 确保代码已推送到 GitHub
git push origin main

# 进入 GitHub 仓库 Settings → Pages
# 选择 Source: GitHub Actions
```

### 2️⃣ 自动部署

每次推送到 `main` 分支时自动部署：

```bash
git add .
git commit -m "Your message"
git push origin main
```

### 3️⃣ 查看部署状态

- GitHub 仓库 → **Actions** 标签
- 查看最新的工作流运行状态

### 4️⃣ 访问网站

```
https://YOUR_USERNAME.github.io/app/
```

## 关键文件

| 文件 | 说明 |
|------|------|
| `.github/workflows/deploy.yml` | GitHub Actions 自动部署配置 |
| `vite.config.ts` | Vite 构建配置（已配置 base 路径） |
| `public/.nojekyll` | 禁用 Jekyll 处理 |
| `GITHUB_PAGES_DEPLOY.md` | 详细部署指南 |

## 常见命令

```bash
# 本地开发
npm run dev

# 构建生产版本
npm run build

# 预览构建结果
npm run preview

# 检查构建错误
npm run build 2>&1 | head -50
```

## 故障排查

| 问题 | 解决方案 |
|------|--------|
| 部署失败 | 检查 Actions 日志，查看构建错误 |
| 样式丢失 | 确认 `vite.config.ts` 中 `base` 路径正确 |
| 路由不工作 | React Router 需要配置 `basename` 为 `/app/` |
| 资源 404 | 检查资源路径是否使用了相对路径 |

## 配置仓库名称

如果仓库名称不是 `app`，修改 `vite.config.ts`：

```typescript
base: process.env.GITHUB_PAGES ? '/YOUR_REPO_NAME/' : '/',
```

## 更多帮助

- 详细指南：`GITHUB_PAGES_DEPLOY.md`
- Vite 文档：https://vitejs.dev/guide/static-deploy.html
- GitHub Pages：https://docs.github.com/en/pages
