#!/usr/bin/env node

/**
 * GitHub Pages 部署诊断脚本
 * 用于检查部署配置是否正确
 */

const fs = require('fs');
const path = require('path');

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function checkFile(filePath, description) {
  const fullPath = path.join(process.cwd(), filePath);
  if (fs.existsSync(fullPath)) {
    log(`✅ ${description}`, 'green');
    return true;
  } else {
    log(`❌ ${description} - 文件不存在: ${filePath}`, 'red');
    return false;
  }
}

function checkFileContent(filePath, searchString, description) {
  const fullPath = path.join(process.cwd(), filePath);
  if (!fs.existsSync(fullPath)) {
    log(`❌ ${description} - 文件不存在: ${filePath}`, 'red');
    return false;
  }

  const content = fs.readFileSync(fullPath, 'utf-8');
  if (content.includes(searchString)) {
    log(`✅ ${description}`, 'green');
    return true;
  } else {
    log(`❌ ${description} - 未找到: "${searchString}"`, 'red');
    return false;
  }
}

function main() {
  log('\n🔍 GitHub Pages 部署诊断\n', 'cyan');

  let passed = 0;
  let failed = 0;

  // 检查文件存在
  log('📁 检查文件存在性:', 'blue');
  if (checkFile('vite.config.ts', 'Vite 配置文件')) passed++; else failed++;
  if (checkFile('src/App.tsx', 'React 应用文件')) passed++; else failed++;
  if (checkFile('index.html', 'HTML 入口文件')) passed++; else failed++;
  if (checkFile('public/404.html', '404 处理文件')) passed++; else failed++;
  if (checkFile('public/.nojekyll', 'Jekyll 禁用文件')) passed++; else failed++;
  if (checkFile('.github/workflows/deploy.yml', 'GitHub Actions 工作流')) passed++; else failed++;

  // 检查配置内容
  log('\n⚙️  检查配置内容:', 'blue');
  if (checkFileContent('vite.config.ts', "process.env.GITHUB_PAGES === 'true'", 'Vite base 路径配置')) passed++; else failed++;
  if (checkFileContent('src/App.tsx', "import.meta.env.GITHUB_PAGES", 'React basename 配置')) passed++; else failed++;
  if (checkFileContent('src/App.tsx', 'basename={basename}', 'Router basename 绑定')) passed++; else failed++;
  if (checkFileContent('index.html', 'sessionStorage.redirect', 'HTML 重定向脚本')) passed++; else failed++;
  if (checkFileContent('public/404.html', 'sessionStorage.redirect', '404 重定向脚本')) passed++; else failed++;
  if (checkFileContent('.github/workflows/deploy.yml', "GITHUB_PAGES: 'true'", 'GitHub Actions 环境变量')) passed++; else failed++;

  // 检查 package.json
  log('\n📦 检查 package.json:', 'blue');
  const packageJsonPath = path.join(process.cwd(), 'package.json');
  if (fs.existsSync(packageJsonPath)) {
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
    
    if (packageJson.scripts && packageJson.scripts.build) {
      log('✅ build 脚本存在', 'green');
      passed++;
    } else {
      log('❌ build 脚本不存在', 'red');
      failed++;
    }

    if (packageJson.dependencies && packageJson.dependencies['react-router-dom']) {
      log('✅ react-router-dom 已安装', 'green');
      passed++;
    } else {
      log('❌ react-router-dom 未安装', 'red');
      failed++;
    }
  } else {
    log('❌ package.json 不存在', 'red');
    failed += 2;
  }

  // 总结
  log('\n📊 诊断结果:', 'blue');
  log(`✅ 通过: ${passed}`, 'green');
  log(`❌ 失败: ${failed}`, 'red');

  if (failed === 0) {
    log('\n🎉 所有检查都通过了！可以开始部署。\n', 'green');
    process.exit(0);
  } else {
    log('\n⚠️  请修复上述问题后再部署。\n', 'yellow');
    process.exit(1);
  }
}

main();
