# GitHub Pages 完整部署指南

## 📋 目录
1. [前置准备](#前置准备)
2. [配置说明](#配置说明)
3. [部署步骤](#部署步骤)
4. [验证部署](#验证部署)
5. [常见问题](#常见问题)
6. [故障排查](#故障排查)

---

## 前置准备

### 1. GitHub 账户和仓库
- 确保你有 GitHub 账户
- 创建一个新仓库或使用现有仓库
- 仓库名称建议为 `app`（或根据需要修改）

### 2. 本地环境
```bash
# 确保已安装 Node.js 18+
node --version

# 确保已安装 npm
npm --version

# 确保已安装 git
git --version
```

### 3. 项目初始化
```bash
# 进入项目目录
cd c:\Users\38364\Desktop\app

# 安装依赖
npm install

# 验证构建
npm run build
```

---

## 配置说明

### 已配置的文件

#### 1. `vite.config.ts` - Vite 构建配置
```typescript
base: process.env.GITHUB_PAGES === 'true' ? '/app/' : '/',
```
- **本地开发**：使用 `/` 路径
- **GitHub Pages 部署**：使用 `/app/` 路径（根据仓库名称）

#### 2. `src/App.tsx` - React Router 配置
```typescript
const basename = import.meta.env.GITHUB_PAGES ? '/app' : '/';
<Router basename={basename}>
```
- 确保路由在 GitHub Pages 子路径下正常工作

#### 3. `index.html` - 路由重定向脚本
- 处理 React Router 的客户端路由
- 支持直接访问任何路由 URL

#### 4. `public/404.html` - 404 重定向
- GitHub Pages 自动处理 404 错误
- 重定向到首页，让 React Router 接管路由

#### 5. `public/.nojekyll` - 禁用 Jekyll
- 防止 GitHub Pages 使用 Jekyll 处理文件

#### 6. `.github/workflows/deploy.yml` - GitHub Actions 工作流
- 自动构建和部署
- 监听 `main` 和 `master` 分支

---

## 部署步骤

### 第一步：初始化 Git 仓库

```bash
# 进入项目目录
cd c:\Users\38364\Desktop\app

# 初始化 git（如果还没有）
git init

# 添加远程仓库
git remote add origin https://github.com/YOUR_USERNAME/app.git

# 设置主分支为 main
git branch -M main
```

### 第二步：提交代码

```bash
# 添加所有文件
git add .

# 提交代码
git commit -m "Initial commit: Setup GitHub Pages deployment"

# 推送到 GitHub
git push -u origin main
```

### 第三步：配置 GitHub Pages

1. **进入 GitHub 仓库**
   - 打开 https://github.com/YOUR_USERNAME/app

2. **进入 Settings**
   - 点击仓库右上角的 **Settings**

3. **配置 Pages**
   - 左侧菜单找到 **Pages**
   - 在 **Build and deployment** 部分
   - **Source** 选择 **GitHub Actions**
   - 点击 **Save**

4. **等待部署**
   - 进入 **Actions** 标签
   - 查看工作流运行状态
   - 等待 ✅ 完成

### 第四步：访问网站

部署完成后，访问：
```
https://YOUR_USERNAME.github.io/app/
```

> 将 `YOUR_USERNAME` 替换为你的 GitHub 用户名

---

## 验证部署

### 1. 检查 GitHub Actions 状态

```bash
# 在 GitHub 仓库页面
# 点击 Actions 标签
# 查看最新的工作流运行
# 应该看到 ✅ 绿色的成功标记
```

### 2. 检查部署输出

```bash
# 在工作流运行详情中
# 点击 "deploy" 任务
# 查看 "Deploy to GitHub Pages" 步骤
# 应该看到类似的输出：
# Deployment Status: success
# Page URL: https://YOUR_USERNAME.github.io/app/
```

### 3. 测试网站功能

- 访问首页：`https://YOUR_USERNAME.github.io/app/`
- 测试路由：`https://YOUR_USERNAME.github.io/app/consult`
- 测试其他页面：`https://YOUR_USERNAME.github.io/app/shop`
- 检查样式和资源是否正常加载

### 4. 浏览器开发者工具

```javascript
// 在浏览器控制台检查
console.log(window.location.pathname);  // 应该显示 /app/...
console.log(import.meta.env.BASE_URL);  // 应该显示 /app/
```

---

## 常见问题

### Q1: 如何修改仓库名称？

如果你的仓库名称不是 `app`，需要修改以下文件：

**vite.config.ts**
```typescript
base: process.env.GITHUB_PAGES === 'true' ? '/YOUR_REPO_NAME/' : '/',
```

**src/App.tsx**
```typescript
const basename = import.meta.env.GITHUB_PAGES ? '/YOUR_REPO_NAME' : '/';
```

**public/404.html**
```javascript
window.location.href = '/YOUR_REPO_NAME/';
```

### Q2: 如何更新网站内容？

```bash
# 修改代码后
git add .
git commit -m "Update content"
git push origin main

# GitHub Actions 会自动部署
# 等待 Actions 完成（通常 2-5 分钟）
```

### Q3: 如何回滚到之前的版本？

```bash
# 查看提交历史
git log --oneline

# 回滚到某个提交
git revert COMMIT_HASH
git push origin main

# 或者重置到某个提交
git reset --hard COMMIT_HASH
git push -f origin main
```

### Q4: 如何使用自定义域名？

1. 在 GitHub Pages 设置中添加自定义域名
2. 在你的域名提供商配置 DNS 记录
3. 等待 DNS 生效（通常 24 小时内）

### Q5: 如何禁用部署？

```bash
# 删除工作流文件
rm .github/workflows/deploy.yml

# 或在 GitHub Pages 设置中选择 None
```

---

## 故障排查

### 问题 1: 部署失败

**症状**：GitHub Actions 显示 ❌ 红色错误

**解决方案**：
1. 点击失败的工作流
2. 查看 "Build" 任务的日志
3. 查找错误信息
4. 常见错误：
   - `npm ERR!`：依赖安装失败，检查 `package.json`
   - `tsc error`：TypeScript 编译错误，检查代码
   - `vite build error`：构建错误，检查 `vite.config.ts`

### 问题 2: 样式丢失或资源 404

**症状**：网站加载但样式和图片不显示

**解决方案**：
1. 检查浏览器开发者工具的 Network 标签
2. 查看资源 URL 是否正确
3. 确认 `vite.config.ts` 中的 `base` 路径正确
4. 检查 `src/App.tsx` 中的 `basename` 配置

### 问题 3: 路由不工作

**症状**：直接访问 URL 显示 404，但通过链接导航可以

**解决方案**：
1. 确认 `public/404.html` 存在
2. 确认 `index.html` 中有重定向脚本
3. 检查 `src/App.tsx` 中的 `basename` 配置
4. 清除浏览器缓存后重试

### 问题 4: 部署很慢

**症状**：GitHub Actions 运行时间超过 10 分钟

**解决方案**：
1. 检查 `node_modules` 大小
2. 考虑使用 `npm ci` 而不是 `npm install`
3. 检查是否有大型依赖
4. 考虑优化构建配置

### 问题 5: 环境变量不生效

**症状**：`GITHUB_PAGES` 环境变量未被识别

**解决方案**：
1. 确认 `.github/workflows/deploy.yml` 中设置了 `env: GITHUB_PAGES: 'true'`
2. 在 `vite.config.ts` 中使用 `process.env.GITHUB_PAGES === 'true'`
3. 重新推送代码触发新的工作流

---

## 本地测试

### 模拟 GitHub Pages 环境

```bash
# 设置环境变量并构建
$env:GITHUB_PAGES='true'; npm run build

# 预览构建结果
npm run preview

# 访问 http://localhost:4173/app/
```

### 完整测试流程

```bash
# 1. 清理旧的构建
rm -r dist

# 2. 构建生产版本
$env:GITHUB_PAGES='true'; npm run build

# 3. 预览
npm run preview

# 4. 在浏览器中测试
# - 访问 http://localhost:4173/app/
# - 测试所有路由
# - 检查样式和资源
# - 打开开发者工具检查控制台错误
```

---

## 性能优化建议

### 1. 减小包体积

你的 `vite.config.ts` 已配置：
- ✅ 代码分割（Code Splitting）
- ✅ 懒加载路由
- ✅ 第三方库分离
- ✅ CSS 代码分割

### 2. 缓存策略

- 静态资源使用 hash 命名
- 浏览器会缓存 `[hash]` 文件
- 更新代码时 hash 会改变，强制更新

### 3. 监控部署

```bash
# 查看构建输出大小
npm run build

# 输出会显示：
# dist/assets/js/react-vendor-xxx.js  123.45 kB
# dist/assets/js/antd-vendor-xxx.js   456.78 kB
# ...
```

---

## 总结

| 步骤 | 命令 | 说明 |
|------|------|------|
| 1 | `git init` | 初始化 Git |
| 2 | `git remote add origin ...` | 添加远程仓库 |
| 3 | `git add .` | 添加文件 |
| 4 | `git commit -m "..."` | 提交代码 |
| 5 | `git push -u origin main` | 推送到 GitHub |
| 6 | GitHub Settings → Pages | 配置 GitHub Pages |
| 7 | 等待 Actions 完成 | 自动部署 |
| 8 | 访问网站 | `https://YOUR_USERNAME.github.io/app/` |

---

## 获取帮助

- [GitHub Pages 官方文档](https://docs.github.com/en/pages)
- [Vite 部署指南](https://vitejs.dev/guide/static-deploy.html#github-pages)
- [React Router 文档](https://reactrouter.com/)
- [GitHub Actions 文档](https://docs.github.com/en/actions)
