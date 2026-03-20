# GitHub Pages 部署流程详解

## 📊 完整部署流程图

```
┌──────────────────────────────────────────────────────────────────────────┐
│                         🚀 GitHub Pages 部署流程                          │
└──────────────────────────────────────────────────────────────────────────┘

第 1 步：本地开发
═══════════════════════════════════════════════════════════════════════════
┌─────────────────────────────────────────────────────────────────────────┐
│ 1. 编写代码                                                              │
│    - 修改 React 组件                                                     │
│    - 更新样式                                                            │
│    - 添加新功能                                                          │
│                                                                          │
│ 2. 本地测试                                                              │
│    $ npm run dev                                                         │
│    访问 http://localhost:5173/                                           │
│                                                                          │
│ 3. 构建测试                                                              │
│    $ npm run build                                                       │
│    $ npm run preview                                                     │
│    访问 http://localhost:4173/app/                                       │
└─────────────────────────────────────────────────────────────────────────┘
                                    ↓
第 2 步：提交代码到 GitHub
═══════════════════════════════════════════════════════════════════════════
┌─────────────────────────────────────────────────────────────────────────┐
│ 1. 添加文件                                                              │
│    $ git add .                                                           │
│                                                                          │
│ 2. 提交代码                                                              │
│    $ git commit -m "Update: description"                                 │
│                                                                          │
│ 3. 推送到 GitHub                                                         │
│    $ git push origin main                                                │
│                                                                          │
│ 📍 代码现在在 GitHub 仓库中                                              │
└─────────────────────────────────────────────────────────────────────────┘
                                    ↓
第 3 步：GitHub Actions 自动构建
═══════════════════════════════════════════════════════════════════════════
┌─────────────────────────────────────────────────────────────────────────┐
│ GitHub 检测到 main 分支有新提交                                          │
│ ↓                                                                        │
│ 触发 .github/workflows/deploy.yml 工作流                                 │
│ ↓                                                                        │
│ 步骤 1: Checkout code                                                    │
│   - 检出最新代码                                                         │
│ ✅ 完成                                                                  │
│ ↓                                                                        │
│ 步骤 2: Setup Node.js                                                    │
│   - 安装 Node.js 18                                                      │
│ ✅ 完成                                                                  │
│ ↓                                                                        │
│ 步骤 3: Install dependencies                                             │
│   - 运行 npm ci                                                          │
│   - 安装所有依赖                                                         │
│ ✅ 完成                                                                  │
│ ↓                                                                        │
│ 步骤 4: Type check                                                       │
│   - 运行 TypeScript 类型检查                                             │
│ ✅ 完成                                                                  │
│ ↓                                                                        │
│ 步骤 5: Build project                                                    │
│   - 设置环境变量 GITHUB_PAGES=true                                       │
│   - 运行 npm run build                                                   │
│   - Vite 使用 base: '/app/'                                              │
│   - 生成 dist/ 文件夹                                                    │
│ ✅ 完成                                                                  │
│ ↓                                                                        │
│ 步骤 6: Upload artifact                                                  │
│   - 上传 dist/ 文件夹到 GitHub                                           │
│ ✅ 完成                                                                  │
│                                                                          │
│ 📍 构建产物已准备好部署                                                  │
└─────────────────────────────────────────────────────────────────────────┘
                                    ↓
第 4 步：GitHub Pages 自动部署
═══════════════════════════════════════════════════════════════════════════
┌─────────────────────────────────────────────────────────────────────────┐
│ GitHub Pages 检测到新的构建产物                                          │
│ ↓                                                                        │
│ 步骤 1: Deploy to GitHub Pages                                           │
│   - 从 dist/ 文件夹部署                                                  │
│   - 配置 GitHub Pages 服务器                                             │
│   - 生成访问 URL                                                         │
│ ✅ 完成                                                                  │
│                                                                          │
│ 📍 网站已上线                                                            │
└─────────────────────────────────────────────────────────────────────────┘
                                    ↓
第 5 步：网站上线
═══════════════════════════════════════════════════════════════════════════
┌─────────────────────────────────────────────────────────────────────────┐
│ 访问网站                                                                 │
│ https://YOUR_USERNAME.github.io/app/                                     │
│                                                                          │
│ 用户访问流程：                                                           │
│ 1. 用户访问 URL                                                          │
│ 2. GitHub Pages 服务器返回 index.html                                    │
│ 3. React 应用加载                                                        │
│ 4. React Router 根据 URL 渲染对应页面                                    │
│                                                                          │
│ 📍 用户可以访问网站                                                      │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 🔄 路由处理流程

### 场景 1：通过链接导航

```
用户点击链接
    ↓
React Router 拦截
    ↓
更新 URL（不刷新页面）
    ↓
React 重新渲染对应组件
    ↓
页面更新完成
```

### 场景 2：直接访问 URL

```
用户直接访问 https://YOUR_USERNAME.github.io/app/consult
    ↓
GitHub Pages 服务器查找 /app/consult 文件
    ↓
文件不存在 → 返回 404 错误
    ↓
GitHub Pages 自动返回 public/404.html
    ↓
404.html 中的脚本运行：
  - 保存原始路径到 sessionStorage
  - 重定向到 /app/
    ↓
index.html 加载
    ↓
index.html 中的脚本运行：
  - 从 sessionStorage 读取原始路径
  - 使用 history.replaceState 恢复 URL
    ↓
React 应用加载
    ↓
React Router 根据 URL 渲染对应页面
    ↓
页面显示正确内容
```

### 场景 3：刷新页面

```
用户在 https://YOUR_USERNAME.github.io/app/shop 刷新
    ↓
浏览器请求 /app/shop
    ↓
GitHub Pages 返回 404
    ↓
执行 404.html 重定向脚本
    ↓
重定向到 /app/
    ↓
index.html 加载并恢复原始 URL
    ↓
React Router 渲染 /shop 页面
    ↓
页面显示正确内容
```

---

## 📁 文件结构和作用

```
app/
│
├── 📄 vite.config.ts
│   └─ 作用：配置 base 路径
│      - 开发：base = '/'
│      - 生产：base = '/app/'
│
├── 📄 src/App.tsx
│   └─ 作用：配置 React Router basename
│      - 开发：basename = '/'
│      - 生产：basename = '/app'
│
├── 📄 index.html
│   └─ 作用：HTML 入口，包含重定向脚本
│      - 处理 404 重定向后的路由恢复
│
├── 📁 public/
│   ├── 📄 404.html
│   │   └─ 作用：GitHub Pages 404 处理
│   │      - 保存原始路径
│   │      - 重定向到首页
│   │
│   └── 📄 .nojekyll
│       └─ 作用：禁用 Jekyll 处理
│
├── 📁 .github/
│   └── 📁 workflows/
│       └── 📄 deploy.yml
│           └─ 作用：GitHub Actions 工作流
│              - 监听 main 分支
│              - 自动构建和部署
│
└── 📁 dist/
    └─ 作用：构建输出目录
       - 包含所有生产文件
       - 由 GitHub Pages 部署
```

---

## 🔧 环境变量流程

```
本地开发
├─ GITHUB_PAGES 未设置
├─ vite.config.ts: base = '/'
├─ src/App.tsx: basename = '/'
└─ 访问 http://localhost:5173/

GitHub Actions 构建
├─ 设置 GITHUB_PAGES=true
├─ vite.config.ts: base = '/app/'
├─ src/App.tsx: basename = '/app'
└─ 生成 dist/ 文件夹

GitHub Pages 部署
├─ 部署 dist/ 文件夹
├─ 所有资源使用 /app/ 前缀
└─ 访问 https://YOUR_USERNAME.github.io/app/
```

---

## ⏱️ 时间线

```
T+0min   推送代码到 GitHub
         $ git push origin main

T+0min   GitHub 检测到新提交
         Actions 工作流开始

T+1min   依赖安装完成
         开始构建

T+2min   构建完成
         上传构建产物

T+3min   GitHub Pages 开始部署
         配置服务器

T+4min   部署完成
         网站上线 ✅

T+4min   用户可以访问网站
         https://YOUR_USERNAME.github.io/app/
```

---

## 🎯 关键配置点

### 1. Vite 配置

```typescript
// vite.config.ts
base: process.env.GITHUB_PAGES === 'true' ? '/app/' : '/',
```

**为什么需要**：
- 告诉 Vite 应用的基础路径
- 确保所有资源 URL 正确

**如果配置错误**：
- ❌ 样式加载失败
- ❌ 图片显示不出来
- ❌ 脚本加载失败

### 2. React Router 配置

```typescript
// src/App.tsx
const basename = import.meta.env.GITHUB_PAGES ? '/app' : '/';
<Router basename={basename}>
```

**为什么需要**：
- 告诉 React Router 应用的基础路径
- 确保路由在子路径下正常工作

**如果配置错误**：
- ❌ 路由导航不工作
- ❌ URL 显示不正确
- ❌ 返回按钮不工作

### 3. 404 处理

```html
<!-- public/404.html -->
<script>
  const path = decodeURI(window.location.pathname);
  if (path !== '/' && !path.match(/\.\w+$/)) {
    sessionStorage.redirect = path;
    window.location.href = '/app/';
  }
</script>
```

**为什么需要**：
- GitHub Pages 不支持客户端路由
- 需要通过 404 重定向来实现

**如果配置错误**：
- ❌ 直接访问 URL 显示 404
- ❌ 刷新页面显示 404

### 4. HTML 重定向脚本

```html
<!-- index.html -->
<script>
  const redirect = sessionStorage.redirect;
  delete sessionStorage.redirect;
  if (redirect && redirect !== window.location.pathname) {
    window.history.replaceState(null, null, redirect);
  }
</script>
```

**为什么需要**：
- 恢复 404 重定向前的原始 URL
- 让用户看到正确的 URL

**如果配置错误**：
- ❌ URL 显示为 /app/ 而不是实际路径
- ❌ 用户体验不好

---

## 🚨 常见错误和解决方案

### 错误 1：样式丢失

```
症状：网站加载但没有样式
原因：base 路径配置错误
解决：检查 vite.config.ts 中的 base 配置
```

### 错误 2：路由 404

```
症状：直接访问 URL 显示 404
原因：404.html 缺失或配置错误
解决：确保 public/404.html 存在且配置正确
```

### 错误 3：资源 404

```
症状：图片、字体等资源加载失败
原因：资源路径使用了相对路径
解决：使用 import 导入资源或使用 /app/ 前缀
```

### 错误 4：部署失败

```
症状：GitHub Actions 显示红色错误
原因：构建错误或依赖问题
解决：查看 Actions 日志，修复错误后重新推送
```

---

## ✅ 验证部署成功

### 检查 1：网站可以访问

```bash
# 访问首页
https://YOUR_USERNAME.github.io/app/

# 应该看到首页内容
```

### 检查 2：路由工作正常

```bash
# 访问其他页面
https://YOUR_USERNAME.github.io/app/consult
https://YOUR_USERNAME.github.io/app/shop
https://YOUR_USERNAME.github.io/app/profile

# 应该看到对应页面内容
```

### 检查 3：刷新页面正常

```bash
# 在任何页面按 F5 刷新
# 应该看到相同的页面内容
# URL 应该保持不变
```

### 检查 4：导航工作正常

```bash
# 点击导航链接
# 页面应该快速切换
# URL 应该更新
# 返回按钮应该工作
```

### 检查 5：没有控制台错误

```bash
# 打开浏览器开发者工具 (F12)
# 查看 Console 标签
# 应该没有红色错误信息
```

---

## 📈 性能指标

### 首屏加载时间

```
理想情况：< 2 秒
可接受：< 3 秒
需要优化：> 5 秒
```

### 路由切换时间

```
理想情况：< 500ms
可接受：< 1 秒
需要优化：> 2 秒
```

### 包体积

```
React 相关：~150KB
Ant Design：~400KB
图表库：~300KB
其他：~200KB
总计：~1MB（gzip 后 ~300KB）
```

---

## 🔄 更新流程

### 更新代码

```bash
# 1. 修改代码
# 编辑文件...

# 2. 本地测试
npm run dev
# 测试功能...

# 3. 提交代码
git add .
git commit -m "Update: description"
git push origin main

# 4. 等待部署
# GitHub Actions 自动构建和部署
# 通常 2-5 分钟

# 5. 验证更新
# 访问网站检查更新
```

### 更新依赖

```bash
# 1. 更新依赖
npm update

# 2. 测试
npm run build
npm run preview

# 3. 提交
git add package.json package-lock.json
git commit -m "Update dependencies"
git push origin main

# 4. 等待部署
```

---

## 📞 获取帮助

1. **查看文档**
   - `GITHUB_PAGES_COMPLETE_GUIDE.md` - 完整指南
   - `GITHUB_PAGES_CONFIG.md` - 配置参考
   - `DEPLOYMENT_CHECKLIST.md` - 检查清单

2. **运行诊断**
   ```bash
   node scripts/diagnose-deployment.js
   ```

3. **查看日志**
   - GitHub Actions 日志
   - 浏览器开发者工具

4. **参考资源**
   - GitHub Pages 官方文档
   - Vite 部署指南
   - React Router 文档

---

**祝部署顺利！🚀**
