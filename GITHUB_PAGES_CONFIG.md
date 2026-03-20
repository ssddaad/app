# GitHub Pages 部署配置参考

## 项目信息

- **项目名称**：乳此安心
- **仓库名称**：app
- **GitHub 用户名**：YOUR_USERNAME（需要替换）
- **部署 URL**：https://YOUR_USERNAME.github.io/app/

## 配置文件清单

### 1. vite.config.ts
**用途**：Vite 构建配置
**关键配置**：
```typescript
base: process.env.GITHUB_PAGES === 'true' ? '/app/' : '/',
```

### 2. src/App.tsx
**用途**：React 应用主文件
**关键配置**：
```typescript
const basename = import.meta.env.GITHUB_PAGES ? '/app' : '/';
<Router basename={basename}>
```

### 3. index.html
**用途**：HTML 入口文件
**关键功能**：路由重定向脚本

### 4. public/404.html
**用途**：GitHub Pages 404 处理
**关键功能**：重定向到首页，让 React Router 接管

### 5. public/.nojekyll
**用途**：禁用 Jekyll 处理
**内容**：空文件

### 6. .github/workflows/deploy.yml
**用途**：GitHub Actions 自动部署
**触发条件**：推送到 main/master 分支

## 环境变量

### 本地开发
```bash
# 不设置 GITHUB_PAGES
npm run dev
# base 路径为 /
# basename 为 /
```

### GitHub Pages 部署
```bash
# 设置 GITHUB_PAGES=true
GITHUB_PAGES=true npm run build
# base 路径为 /app/
# basename 为 /app
```

## 部署流程

```
┌─────────────────────────────────────────────────────────┐
│ 1. 本地开发                                              │
│    npm run dev                                           │
│    访问 http://localhost:5173/                           │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│ 2. 提交代码到 GitHub                                     │
│    git add .                                             │
│    git commit -m "message"                               │
│    git push origin main                                  │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│ 3. GitHub Actions 自动构建                               │
│    - 检出代码                                            │
│    - 安装依赖                                            │
│    - 构建项目 (GITHUB_PAGES=true)                        │
│    - 上传构建产物                                        │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│ 4. GitHub Pages 自动部署                                 │
│    - 部署到 GitHub Pages                                │
│    - 生成访问 URL                                       │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│ 5. 网站上线                                              │
│    访问 https://YOUR_USERNAME.github.io/app/             │
└─────────────────────────────────────────────────────────┘
```

## 文件结构

```
app/
├── .github/
│   └── workflows/
│       └── deploy.yml              # GitHub Actions 工作流
├── public/
│   ├── .nojekyll                   # 禁用 Jekyll
│   └── 404.html                    # 404 重定向
├── src/
│   ├── App.tsx                     # React 应用（已配置 basename）
│   ├── main.tsx
│   ├── pages/
│   ├── components/
│   └── ...
├── index.html                      # HTML 入口（已配置重定向脚本）
├── vite.config.ts                  # Vite 配置（已配置 base）
├── package.json
├── tsconfig.json
├── GITHUB_PAGES_COMPLETE_GUIDE.md  # 完整部署指南
├── GITHUB_PAGES_QUICK_START.md     # 快速参考
├── DEPLOYMENT_CHECKLIST.md         # 部署检查清单
└── GITHUB_PAGES_CONFIG.md          # 本文件
```

## 关键路径配置

### 开发环境
- **base 路径**：`/`
- **basename**：`/`
- **访问 URL**：`http://localhost:5173/`

### 生产环境（GitHub Pages）
- **base 路径**：`/app/`
- **basename**：`/app`
- **访问 URL**：`https://YOUR_USERNAME.github.io/app/`

## 路由示例

### 开发环境
```
http://localhost:5173/              → 首页
http://localhost:5173/consult       → 咨询页面
http://localhost:5173/shop          → 商城页面
```

### 生产环境
```
https://YOUR_USERNAME.github.io/app/              → 首页
https://YOUR_USERNAME.github.io/app/consult       → 咨询页面
https://YOUR_USERNAME.github.io/app/shop          → 商城页面
```

## 构建输出

构建后的文件结构：

```
dist/
├── index.html                      # 主 HTML 文件
├── 404.html                        # 404 处理
├── .nojekyll                       # Jekyll 禁用标记
└── assets/
    ├── js/
    │   ├── react-vendor-xxx.js
    │   ├── antd-vendor-xxx.js
    │   ├── charts-vendor-xxx.js
    │   └── ...
    ├── css/
    │   └── index-xxx.css
    ├── images/
    │   └── ...
    └── fonts/
        └── ...
```

## 性能指标

### 构建大小
- React 相关：~150KB
- Ant Design：~400KB
- 图表库：~300KB
- 其他依赖：~200KB
- **总计**：~1MB（gzip 后 ~300KB）

### 加载时间
- 首屏加载：< 2 秒
- 路由切换：< 1 秒
- 完全加载：< 3 秒

## 常见配置错误

### ❌ 错误 1：base 路径错误
```typescript
// 错误
base: '/app/',  // 本地开发时会导致 404

// 正确
base: process.env.GITHUB_PAGES === 'true' ? '/app/' : '/',
```

### ❌ 错误 2：basename 缺失
```typescript
// 错误
<Router>  // GitHub Pages 上路由不工作

// 正确
<Router basename={basename}>
```

### ❌ 错误 3：404.html 缺失
```
// 错误：直接访问 URL 显示 404
// 正确：404.html 重定向到首页
```

### ❌ 错误 4：环境变量未设置
```bash
# 错误
npm run build  # GITHUB_PAGES 未设置

# 正确
GITHUB_PAGES=true npm run build
```

## 验证部署

### 检查清单
- [ ] 网站可以访问
- [ ] 首页加载正常
- [ ] 样式完整
- [ ] 路由工作正常
- [ ] 直接访问 URL 不出现 404
- [ ] 刷新页面正常
- [ ] 返回按钮工作正常
- [ ] 控制台没有错误

### 测试命令
```bash
# 本地模拟 GitHub Pages 环境
$env:GITHUB_PAGES='true'; npm run build
npm run preview
# 访问 http://localhost:4173/app/
```

## 更新部署

### 更新代码
```bash
# 修改代码后
git add .
git commit -m "Update: description"
git push origin main

# GitHub Actions 自动部署
# 等待 2-5 分钟
```

### 更新依赖
```bash
# 更新依赖
npm update

# 构建测试
npm run build

# 提交更新
git add package.json package-lock.json
git commit -m "Update dependencies"
git push origin main
```

## 故障排查

### 问题：部署失败
**检查**：
1. GitHub Actions 日志
2. 构建错误信息
3. 依赖是否安装成功

### 问题：样式丢失
**检查**：
1. base 路径是否正确
2. CSS 文件是否生成
3. 浏览器缓存

### 问题：路由 404
**检查**：
1. 404.html 是否存在
2. index.html 重定向脚本
3. basename 配置

## 参考资源

- [GitHub Pages 官方文档](https://docs.github.com/en/pages)
- [Vite 部署指南](https://vitejs.dev/guide/static-deploy.html#github-pages)
- [React Router 文档](https://reactrouter.com/)
- [GitHub Actions 文档](https://docs.github.com/en/actions)

---

**最后更新**：2026-03-20
**配置版本**：1.0
