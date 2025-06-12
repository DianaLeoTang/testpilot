/*
 * @Author: Diana Tang
 */
// jest.config.js
const path = require('path');

module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  
  // 重要：从用户项目根目录开始查找测试
  rootDir: process.cwd(),
  
  testMatch: [
    '**/tests/**/*.test.ts',
    '**/tests/**/*.test.js'
  ],
  
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html'],
  
  // 覆盖率只统计用户项目的源码
  collectCoverageFrom: [
    'src/**/*.{ts,js}',
    '!src/**/*.d.ts'
  ],
  
  // 确保能处理 TypeScript
  transform: {
    '^.+\\.ts$': 'ts-jest'
  },
  
  // 模块解析
  moduleFileExtensions: ['ts', 'js', 'json'],
  
  // 忽略 node_modules，但允许 ts-jest 处理
  transformIgnorePatterns: [
    'node_modules/(?!(.*\\.mjs$))'
  ]
};