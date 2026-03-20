import { fileURLToPath } from 'url'
import path from 'path'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// https://vite.dev/config/
const isGithubPages = process.env.GITHUB_PAGES === 'true'

export default defineConfig({
  base: isGithubPages ? '/app/' : '/',
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false,
      },
    },
  },
  build: {
    // 目标现代浏览器，减小 polyfill 体积
    target: 'es2020',
    // 超过 1500KB 才警告（antd + echarts 本身体积较大）
    chunkSizeWarningLimit: 1500,
    // 开启 CSS 代码分割
    cssCodeSplit: true,
    // 生产环境去掉 sourcemap（减小产物体积，保护源码）
    sourcemap: false,
    rollupOptions: {
      output: {
        // 手动 chunk 分割策略：将大型第三方库单独打包，充分利用浏览器缓存
        manualChunks: {
          'react-vendor':  ['react', 'react-dom', 'react-router-dom'],
          'antd-vendor':   ['antd', '@ant-design/icons'],
          'charts-vendor': ['echarts', 'echarts-for-react', 'recharts'],
          'motion-vendor': ['framer-motion'],
          'utils-vendor':  ['axios', 'date-fns', 'zustand', 'zod'],
          'radix-vendor': [
            '@radix-ui/react-dialog',
            '@radix-ui/react-dropdown-menu',
            '@radix-ui/react-select',
            '@radix-ui/react-tabs',
            '@radix-ui/react-tooltip',
            '@radix-ui/react-popover',
            '@radix-ui/react-accordion',
          ],
        },
        // 静态资源按类型分目录
        assetFileNames: (assetInfo) => {
          const name = assetInfo.name ?? ''
          if (/\.(png|jpe?g|gif|svg|webp|ico)$/i.test(name))
            return 'assets/images/[name]-[hash][extname]'
          if (/\.css$/i.test(name))
            return 'assets/css/[name]-[hash][extname]'
          if (/\.(woff2?|eot|ttf|otf)$/i.test(name))
            return 'assets/fonts/[name]-[hash][extname]'
          return 'assets/[name]-[hash][extname]'
        },
        chunkFileNames:  'assets/js/[name]-[hash].js',
        entryFileNames:  'assets/js/[name]-[hash].js',
      },
    },
    // esbuild 压缩（比 terser 更快）
    minify: 'esbuild',
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom', 'antd', 'axios', 'zustand'],
  },
})
