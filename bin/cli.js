#!/usr/bin/env node

const path = require('path');
const fs = require('fs');

// 检查 dist 目录是否存在
const distPath = path.join(__dirname, '../dist/index.js');

if (!fs.existsSync(distPath)) {
  console.error('Error: Build files not found. Please run "npm run build" first.');
  process.exit(1);
}

try {
  // 获取命令行参数
  const args = process.argv.slice(2);
  
  // 设置命令行参数到 process.argv，这样 dist/index.js 可以读取到
  process.argv = ['node', 'ai-testpilot', ...args];
  
  require('../dist/index.js');
} catch (error) {
  console.error('Error running ai-testpilot:', error.message);
  process.exit(1);
}