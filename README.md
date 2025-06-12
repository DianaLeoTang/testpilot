# 🧪 AI-TestPilot Automated Testing Tool

**AI-TestPilot** is a universal automated test generator (MCP) for any Node.js + TypeScript project that can scan, generate, run tests and output reports with one click.

## 🚀 Key Features

- Automatically scan project source code
- Auto-generate Jest test script stubs
- Execute tests and generate coverage reports
- Support for NestJS, Express, Vite and any Node.js projects

## 📦 Installation

### Global Installation (Recommended)
```bash
npm install -g ai-testpilot
```

### Install from Source
```bash
git clone https://github.com/DianaLeoTang/testpilot.git
cd testpilot
npm install
npm run build
npm link
```

## 🛠 Usage

### Global Commands
```bash
# 1. Generate test stubs (tests/xxx.test.ts)
ai-testpilot generate

# 2. Execute tests (using Jest)
ai-testpilot run

# 3. View report path hints
ai-testpilot report
```

### Local Project Scripts
```bash
# 1. Generate test stubs (tests/xxx.test.ts)
npm run generate

# 2. Execute tests (using Jest)
npm run run

# 3. View report path hints
npm run report
```

## 📁 Project Structure

```
ai-testpilot/
├── bin/
│   └── cli.js            # CLI entry point
├── src/
│   ├── index.ts          # Main entry
│   ├── scanner.ts        # Scan src/ source files
│   ├── generator.ts      # Generate Jest stubs
│   ├── runner.ts         # Call Jest to execute tests
│   └── reporter.ts       # Output report location
├── templates/
│   └── jest.test.stub.ts # Test template
├── tests/                # Auto-generated test files
├── dist/                 # Compiled files
├── tsconfig.json
└── package.json
```

## ✅ Output Example

```ts
import { describe, it, expect } from '@jest/globals';
import { example } from '../src/example';

describe('example', () => {
  it('should work correctly', () => {
    expect(true).toBe(true);
  });
});
```

## 🎯 Use Cases

- **Quick Start for New Projects**: Rapidly generate test framework for new TypeScript projects
- **Add Tests to Existing Projects**: Generate test stubs for existing code lacking tests
- **CI/CD Integration**: Part of automated testing workflow
- **Code Quality Assurance**: Ensure projects have complete test coverage

## ⚙️ Supported Project Types

- NestJS applications
- Express.js servers
- Vite frontend projects
- General Node.js + TypeScript projects
- Any project using Jest

## ❓ FAQ

### Why do I get ENOENT error when running?

Please ensure the `tests/` directory exists in your project, or add auto-creation logic in the code.

### How to customize test templates?

Modify the `templates/jest.test.stub.ts` file to customize the generated test templates.

### Do you support other testing frameworks?

Currently mainly supports Jest, with plans to support more testing frameworks in the future.

## 🔧 Development

### Local Development
```bash
git clone https://github.com/DianaLeoTang/testpilot.git
cd testpilot
npm install
npm run build
npm link
ai-testpilot --help
```

### Run Tests
```bash
npm test
```

## 🤝 Contributing

Issues and Pull Requests are welcome!

## 🔗 Links

- [GitHub Repository](https://github.com/DianaLeoTang/testpilot)
- [NPM Package](https://npmjs.com/package/ai-testpilot)
- [Issue Tracker](https://github.com/DianaLeoTang/testpilot/issues)

---

### 📜 License

MIT © Diana Tang