# GitHub Pages 部署指南

## 快速开始

### 1. 仓库设置

首先，确保你的项目已推送到 GitHub：

```bash
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git branch -M main
git push -u origin main
```

### 2. 启用 GitHub Pages

1. 进入你的 GitHub 仓库
2. 点击 **Settings** → **Pages**
3. 在 **Build and deployment** 部分：
   - **Source** 选择 **GitHub Actions**
   - 保存设置

### 3. 自动部署

当你推送代码到 `main` 或 `master` 分支时，GitHub Actions 会自动：
- 安装依赖
- 构建项目
- 部署到 GitHub Pages

### 4. 访问你的网站

部署完成后，你可以通过以下 URL 访问：

```
https://YOUR_USERNAME.github.io/app/
```

> 注意：如果仓库名称不是 `app`，请将 URL 中的 `app` 替换为你的仓库名称

## 配置说明

### vite.config.ts

已配置 `base` 路径为：
- 本地开发：`/`
- GitHub Pages 部署：`/app/`（根据仓库名称自动调整）

如果你的仓库名称不同，需要修改 `vite.config.ts`：

```typescript
base: process.env.GITHUB_PAGES ? '/YOUR_REPO_NAME/' : '/',
```

### GitHub Actions 工作流

工作流文件位置：`.github/workflows/deploy.yml`

功能：
- 监听 `main` 和 `master` 分支的推送
- 自动构建和部署
- 仅在推送到主分支时部署（PR 时只构建）

## 常见问题

### Q: 如何更新网站内容？

A: 只需推送代码到 `main` 分支，GitHub Actions 会自动部署：

```bash
git add .
git commit -m "Update content"
git push origin main
```

### Q: 部署失败怎么办？

A: 检查 GitHub Actions 日志：
1. 进入仓库的 **Actions** 标签
2. 查看最新的工作流运行
3. 检查失败的步骤日志

常见原因：
- 构建错误（检查 `npm run build` 输出）
- 依赖安装失败（检查 `package.json`）
- Node.js 版本不兼容

### Q: 如何自定义域名？

A: 在 GitHub Pages 设置中：
1. 进入 **Settings** → **Pages**
2. 在 **Custom domain** 输入你的域名
3. 按照 GitHub 的指引配置 DNS 记录

### Q: 如何禁用部署？

A: 删除 `.github/workflows/deploy.yml` 文件或在 GitHub Pages 设置中选择 **None** 作为源。

## 本地开发

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 预览构建结果
npm run preview
```

## 更多信息

- [GitHub Pages 官方文档](https://docs.github.com/en/pages)
- [Vite 部署指南](https://vitejs.dev/guide/static-deploy.html#github-pages)
- [GitHub Actions 文档](https://docs.github.com/en/actions)
