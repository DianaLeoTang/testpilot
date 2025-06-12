# 🧪 AI-TestPilot 自动化测试工具

**Languages**: [English](README.md) | [中文](README-zh.md)

---

**AI-TestPilot** 是一个通用于任意 Node.js + TypeScript 项目的自动化测试生成器（MCP），可一键扫描、生成、运行测试并输出报告。

## 🚀 功能亮点

- 自动扫描项目源代码
- 自动生成 Jest 测试脚本 stub
- 执行测试并生成覆盖率报告
- 支持 NestJS、Express、Vite 等任意 Node.js 项目

## 📦 安装方法

### 全局安装（推荐）
```bash
npm install -g ai-testpilot
```

### 从源码安装
```bash
git clone https://github.com/DianaLeoTang/testpilot.git
cd testpilot
npm install
npm run build
npm link
```

## 🛠 使用说明

### 全局命令
```bash
# 1. 生成测试 stub（tests/xxx.test.ts）
ai-testpilot generate

# 2. 执行测试（使用 Jest）
ai-testpilot run

# 3. 查看报告路径提示
ai-testpilot report
```

### 本地项目脚本
```bash
# 1. 生成测试 stub（tests/xxx.test.ts）
npm run generate

# 2. 执行测试（使用 Jest）
npm run run

# 3. 查看报告路径提示
npm run report
```

## 📁 项目结构说明

```
ai-testpilot/
├── bin/
│   └── cli.js            # CLI 入口文件
├── src/
│   ├── index.ts          # 主入口
│   ├── scanner.ts        # 扫描 src/ 源文件
│   ├── generator.ts      # 生成 Jest stub
│   ├── runner.ts         # 调用 Jest 执行测试
│   └── reporter.ts       # 输出报告位置
├── templates/
│   └── jest.test.stub.ts # 测试模板
├── tests/                # 自动生成的测试文件
├── dist/                 # 编译后的文件
├── tsconfig.json
└── package.json
```

## ✅ 输出示例

```ts
import { describe, it, expect } from '@jest/globals';
import { example } from '../src/example';

describe('example', () => {
  it('should work correctly', () => {
    expect(true).toBe(true);
  });
});
```

## 🎯 使用场景

- **新项目快速开始**: 为新的 TypeScript 项目快速生成测试框架
- **现有项目补充测试**: 为缺少测试的现有代码生成测试桩
- **CI/CD 集成**: 自动化测试流程的一部分
- **代码质量保证**: 确保项目有完整的测试覆盖

## ⚙️ 支持的项目类型

- NestJS 应用
- Express.js 服务器
- Vite 前端项目
- 通用 Node.js + TypeScript 项目
- 任何使用 Jest 的项目

## ❓ 常见问题

### 为什么运行时报 ENOENT 错误？

请确保项目中存在 `tests/` 目录，或在代码中添加自动创建逻辑。

### 如何自定义测试模板？

修改 `templates/jest.test.stub.ts` 文件来自定义生成的测试模板。

### 支持其他测试框架吗？

目前主要支持 Jest，未来计划支持更多测试框架。

## 🔧 开发

### 本地开发
```bash
git clone https://github.com/DianaLeoTang/testpilot.git
cd testpilot
npm install
npm run build
npm link
ai-testpilot --help
```

### 运行测试
```bash
npm test
```

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 🔗 相关链接

- [GitHub 仓库](https://github.com/DianaLeoTang/testpilot)
- [NPM 包](https://npmjs.com/package/ai-testpilot)
- [问题反馈](https://github.com/DianaLeoTang/testpilot/issues)

---

### 📜 开源协议

MIT © Diana Tang