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
