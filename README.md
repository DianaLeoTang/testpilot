
# 🧪 TestPilot

**TestPilot** is a universal MCP (Multi-Context Process) tool for automatic test script generation and execution, compatible with any Node.js project using TypeScript.

## 🚀 Features

- Automatically scans your source files
- Generates Jest test stubs
- Runs test cases and generates coverage reports
- Supports all Node.js + TypeScript projects (NestJS, Express, Vite, etc.)

## 📦 Installation

```bash
git clone https://github.com/your-repo/testpilot.git
cd testpilot
npm install
````

## 🛠 Usage

```bash
# 1. Generate test stubs
npm run generate

# 2. Run tests (uses Jest)
npm run run

# 3. Show report location
npm run report
```

## 📁 Project Structure

```
testpilot/
├── index.ts              # CLI entry
├── src/
│   ├── scanner.ts        # Scans source files
│   ├── generator.ts      # Generates test stubs
│   ├── runner.ts         # Runs tests
│   └── reporter.ts       # Shows report info
├── templates/
│   └── jest.test.stub.ts # Test stub template
├── tests/                # Output tests folder
├── tsconfig.json
└── package.json
```

## 🧪 Output Example

```ts
// tests/yourModule.test.ts
import { describe, it, expect } from '@jest/globals';
import { yourModule } from '../src/yourModule';

describe('yourModule', () => {
  it('should work correctly', () => {
    expect(true).toBe(true);
  });
});
```

## 🧩 FAQ

### Why do I get `ENOENT`?

Make sure the `tests/` folder exists, or let `generator.ts` create it automatically.

---

### 📜 License

MIT © Diana Tang

````

---

### ✅ `README.zh-CN.md`（中文版）

```markdown
# 🧪 TestPilot 自动化测试工具

**TestPilot** 是一个通用于任意 Node.js + TypeScript 项目的自动化测试生成器（MCP），可一键扫描、生成、运行测试并输出报告。

## 🚀 功能亮点

- 自动扫描项目源代码
- 自动生成 Jest 测试脚本 stub
- 执行测试并生成覆盖率报告
- 支持 NestJS、Express、Vite 等任意 Node.js 项目

## 📦 安装方法

```bash
git clone https://github.com/your-repo/testpilot.git
cd testpilot
npm install
````

## 🛠 使用说明

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
testpilot/
├── index.ts              # 命令行入口
├── src/
│   ├── scanner.ts        # 扫描 src/ 源文件
│   ├── generator.ts      # 生成 Jest stub
│   ├── runner.ts         # 调用 Jest 执行测试
│   └── reporter.ts       # 输出报告位置
├── templates/
│   └── jest.test.stub.ts # 测试模板
├── tests/                # 自动生成的测试文件
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

## ❓常见问题

### 为什么运行时报 ENOENT 错误？

请确保项目中存在 `tests/` 目录，或在代码中添加自动创建逻辑。

---

### 📜 开源协议

MIT © Diana Tang
