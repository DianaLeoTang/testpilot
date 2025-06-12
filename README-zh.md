
# 🧪 AI-TestPilot 自动化测试工具

**Languages**: [English](README.md) | [中文](README-zh.md)

## 命令说明

| 命令 | 作用 | 选项 |
|-----|------|------|
| `ai-testpilot generate` | 扫描源文件并生成测试文件 | `--target <dir>` 指定扫描目录（默认：src）<br>`--output <dir>` 指定输出目录（默认：tests） |
| `ai-testpilot run` | 执行所有测试并生成覆盖率报告 | 无 |
| `ai-testpilot report` | 显示测试报告位置 | 无 |
| `ai-testpilot` | 显示帮助信息 | 无 |

### 使用示例
```bash
# 基本用法
ai-testpilot generate
ai-testpilot run

# 自定义目录
ai-testpilot generate --target ./lib --output ./spec
ai-testpilot generate --target ./components

# 完整流程
ai-testpilot generate && ai-testpilot run && ai-testpilot report
```

## 不同使用场景

### 个人项目
- **推荐**：`npx ai-testpilot` 一次性使用
- **优点**：无需安装，随时可用

### 团队项目  
- **推荐**：项目内安装 + npm scripts
- **优点**：版本统一，便于协作

### 持续集成
- **推荐**：集成到 CI/CD 流程
- **优点**：自动化测试，代码质量保障# AI TestPilot

为你的项目自动生成 Jest 测试用例，开箱即用，无需配置。

## 快速开始

### 方式一：全局安装（推荐）
```bash
# 安装
npm install -g ai-testpilot

# 使用
ai-testpilot generate                    # 扫描 src/ 目录生成测试
ai-testpilot generate --target ./lib    # 扫描指定目录
ai-testpilot run                         # 运行测试
ai-testpilot report                      # 查看报告位置
```

### 方式二：项目内安装
```bash
# 安装到项目
npm install --save-dev ai-testpilot

# 添加到 package.json scripts
{
  "scripts": {
    "test:generate": "ai-testpilot generate", 
    "test:run": "ai-testpilot run",
    "test:report": "ai-testpilot report"
  }
}

# 使用
npm run test:generate
npm run test:run
npm run test:report
```

### 方式三：一次性使用
```bash
# 无需安装，直接使用
npx ai-testpilot generate
npx ai-testpilot run
npx ai-testpilot report
```

就这么简单！

## 具体示例

假设你有这样的项目结构：
```
my-project/
├── src/
│   ├── utils.js
│   ├── api.js  
│   └── components/
│       └── Button.js
└── package.json
```

运行 ai-testpilot 后会自动生成：
```
my-project/
├── src/
│   └── ... (你的源码)
├── tests/          # 🆕 自动生成的测试文件
│   ├── utils.test.js
│   ├── api.test.js
│   └── components/
│       └── Button.test.js
├── coverage/       # 🆕 测试覆盖率报告
└── jest.config.js  # 🆕 Jest 配置文件
```

## 团队项目推荐用法

### 项目内安装 + npm scripts
```bash
# 项目维护者
npm install --save-dev ai-testpilot
```

在 `package.json` 中添加：
```json
{
  "scripts": {
    "test": "ai-testpilot run",
    "test:generate": "ai-testpilot generate",
    "test:report": "ai-testpilot report",
    "test:all": "npm run test:generate && npm run test && npm run test:report",
    "test:components": "ai-testpilot generate --target ./src/components"
  }
}
```

这样团队成员只需要：
```bash
# 生成测试文件
npm run test:generate

# 运行测试
npm test

# 查看报告
npm run test:report

# 一键完成所有步骤
npm run test:all

# 只为组件生成测试
npm run test:components
```

### 集成到 CI/CD
```yaml
# .github/workflows/test.yml
name: Test
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm install
      - run: npm run test:generate
      - run: npm test
      - run: npm run test:report
```

## 特色功能

✅ **零配置** - 无需安装 Jest、TypeScript 等依赖  
✅ **智能生成** - 根据源码自动生成合理的测试用例  
✅ **覆盖率报告** - 自动生成详细的测试覆盖率  
✅ **支持多种格式** - JavaScript、TypeScript、React 组件  

## 生成的测试示例

**源文件 (src/utils.js)**
```javascript
export function add(a, b) {
  return a + b;
}

export function isEven(num) {
  return num % 2 === 0;
}
```

**自动生成的测试 (tests/utils.test.js)**  
```javascript
import { add, isEven } from '../src/utils.js';

describe('utils', () => {
  describe('add', () => {
    test('should add two numbers correctly', () => {
      expect(add(2, 3)).toBe(5);
      expect(add(-1, 1)).toBe(0);
    });
  });

  describe('isEven', () => {
    test('should return true for even numbers', () => {
      expect(isEven(2)).toBe(true);
      expect(isEven(4)).toBe(true);
    });
    
    test('should return false for odd numbers', () => {
      expect(isEven(1)).toBe(false);
      expect(isEven(3)).toBe(false);
    });
  });
});
```

## 支持的项目类型

- Node.js 项目
- React 项目  
- TypeScript 项目
- 混合 JS/TS 项目

## 常见问题

**Q: 需要修改我现有的代码吗？**  
A: 不需要，ai-testpilot 只会生成测试文件，不会修改你的源码。

**Q: 生成的测试文件可以修改吗？**  
A: 可以，生成后你可以根据需要修改测试用例。

**Q: 支持已有 Jest 配置的项目吗？**  
A: 支持，ai-testpilot 会检测现有配置并兼容使用。

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 🔗 相关链接

- [GitHub 仓库](https://github.com/DianaLeoTang/testpilot)
- [NPM 包](https://npmjs.com/package/ai-testpilot)
- [问题反馈](https://github.com/DianaLeoTang/testpilot/issues)

---

### 📜 开源协议

MIT © Diana Tang