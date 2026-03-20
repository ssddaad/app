# GitHub Pages 部署检查清单

## ✅ 部署前检查

### 代码准备
- [ ] 所有代码已提交到本地 Git
- [ ] 没有未跟踪的重要文件
- [ ] `npm run build` 构建成功
- [ ] 没有 TypeScript 错误
- [ ] 没有 ESLint 警告

### 配置检查
- [ ] `vite.config.ts` 中 `base` 配置正确
- [ ] `src/App.tsx` 中 `basename` 配置正确
- [ ] `index.html` 中有重定向脚本
- [ ] `public/404.html` 存在
- [ ] `public/.nojekyll` 存在
- [ ] `.github/workflows/deploy.yml` 存在

### GitHub 准备
- [ ] GitHub 账户已创建
- [ ] 仓库已创建
- [ ] 本地 Git 已配置用户名和邮箱

```bash
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

---

## 🚀 部署步骤检查

### 第 1 步：初始化 Git
```bash
cd c:\Users\38364\Desktop\app
git init
git remote add origin https://github.com/YOUR_USERNAME/app.git
git branch -M main
```
- [ ] 命令执行成功
- [ ] 远程仓库 URL 正确

### 第 2 步：提交代码
```bash
git add .
git commit -m "Initial commit: Setup GitHub Pages deployment"
git push -u origin main
```
- [ ] 代码已推送到 GitHub
- [ ] 在 GitHub 网页上可以看到代码

### 第 3 步：配置 GitHub Pages
1. [ ] 进入 https://github.com/YOUR_USERNAME/app/settings/pages
2. [ ] **Source** 选择 **GitHub Actions**
3. [ ] 点击 **Save**

### 第 4 步：等待部署
1. [ ] 进入 **Actions** 标签
2. [ ] 查看工作流运行状态
3. [ ] 等待 ✅ 完成（通常 2-5 分钟）

### 第 5 步：验证部署
- [ ] 访问 `https://YOUR_USERNAME.github.io/app/`
- [ ] 首页加载正常
- [ ] 样式和图片显示正常
- [ ] 路由导航工作正常

---

## 🔍 部署后验证

### 功能测试
- [ ] 首页加载
- [ ] 点击导航链接
- [ ] 直接访问 URL（如 `/app/consult`）
- [ ] 刷新页面不出现 404
- [ ] 返回按钮工作正常

### 性能检查
- [ ] 页面加载时间 < 3 秒
- [ ] 没有 404 错误
- [ ] 没有 CORS 错误
- [ ] 控制台没有 JavaScript 错误

### 浏览器兼容性
- [ ] Chrome 最新版本
- [ ] Firefox 最新版本
- [ ] Safari 最新版本
- [ ] Edge 最新版本

---

## 📝 常见命令速查

### 本地开发
```bash
npm run dev          # 启动开发服务器
npm run build        # 构建生产版本
npm run preview      # 预览构建结果
npm run lint         # 检查代码
```

### Git 操作
```bash
git status           # 查看状态
git log --oneline    # 查看提交历史
git add .            # 添加所有文件
git commit -m "msg"  # 提交代码
git push origin main # 推送到 GitHub
git pull origin main # 从 GitHub 拉取
```

### 故障排查
```bash
# 查看 GitHub Actions 日志
# 1. 进入 GitHub 仓库
# 2. 点击 Actions 标签
# 3. 点击失败的工作流
# 4. 查看详细日志

# 本地模拟 GitHub Pages 环境
$env:GITHUB_PAGES='true'; npm run build
npm run preview
# 访问 http://localhost:4173/app/
```

---

## 🆘 快速故障排查

| 问题 | 原因 | 解决方案 |
|------|------|--------|
| 部署失败 | 构建错误 | 检查 `npm run build` 输出 |
| 样式丢失 | base 路径错误 | 检查 `vite.config.ts` |
| 路由 404 | 404.html 缺失 | 确认 `public/404.html` 存在 |
| 资源 404 | 路径错误 | 检查浏览器开发者工具 |
| 部署很慢 | 依赖太大 | 检查 `node_modules` 大小 |

---

## 📞 获取帮助

- 详细指南：`GITHUB_PAGES_COMPLETE_GUIDE.md`
- 快速参考：`GITHUB_PAGES_QUICK_START.md`
- GitHub 文档：https://docs.github.com/en/pages
- Vite 文档：https://vitejs.dev/guide/static-deploy.html

---

## 🎯 部署成功标志

✅ 以下所有条件都满足时，部署成功：

1. GitHub Actions 显示 ✅ 绿色成功
2. 网站可以访问：`https://YOUR_USERNAME.github.io/app/`
3. 首页加载正常，样式完整
4. 所有路由都可以访问
5. 刷新页面不出现 404
6. 浏览器控制台没有错误

---

## 📅 后续维护

### 定期更新
```bash
# 更新依赖
npm update

# 检查安全漏洞
npm audit

# 修复漏洞
npm audit fix
```

### 监控部署
- 定期检查 GitHub Actions 日志
- 监控网站性能
- 收集用户反馈

### 备份
```bash
# 定期备份代码
git push origin main
```

---

**祝部署顺利！🎉**
