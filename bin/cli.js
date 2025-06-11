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
  require('../dist/index.js');
} catch (error) {
  console.error('Error running ai-testpilot:', error.message);
  process.exit(1);
}