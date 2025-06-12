# AI TestPilot
**Languages**: [English](README.md) | [中文](README-zh.md)

Automatically generate Jest test cases for your projects. Zero configuration, ready to use out of the box.

## Quick Start

### Option 1: Global Installation (Recommended)
```bash
# Install
npm install -g ai-testpilot

# Use
ai-testpilot generate                    # Scan src/ directory and generate tests
ai-testpilot generate --target ./lib    # Scan specific directory
ai-testpilot run                         # Run tests
ai-testpilot report                      # View report location
```

### Option 2: Project Installation
```bash
# Install to project
npm install --save-dev ai-testpilot

# Add to package.json scripts
{
  "scripts": {
    "test:generate": "ai-testpilot generate", 
    "test:run": "ai-testpilot run",
    "test:report": "ai-testpilot report"
  }
}

# Use
npm run test:generate
npm run test:run
npm run test:report
```

### Option 3: One-time Use
```bash
# No installation required, use directly
npx ai-testpilot generate
npx ai-testpilot run
npx ai-testpilot report
```

It's that simple!

## Example

Suppose you have this project structure:
```
my-project/
├── src/
│   ├── utils.js
│   ├── api.js  
│   └── components/
│       └── Button.js
└── package.json
```

After running ai-testpilot, it will automatically generate:
```
my-project/
├── src/
│   └── ... (your source code)
├── tests/          # 🆕 Auto-generated test files
│   ├── utils.test.js
│   ├── api.test.js
│   └── components/
│       └── Button.test.js
├── coverage/       # 🆕 Test coverage report
└── jest.config.js  # 🆕 Jest configuration file
```

## Command Reference

| Command | Description | Options |
|---------|-------------|---------|
| `ai-testpilot generate` | Scan source files and generate test files | `--target <dir>` Specify scan directory (default: src)<br>`--output <dir>` Specify output directory (default: tests) |
| `ai-testpilot run` | Execute all tests and generate coverage report | None |
| `ai-testpilot report` | Show test report location | None |
| `ai-testpilot` | Show help information | None |

### Usage Examples
```bash
# Basic usage
ai-testpilot generate
ai-testpilot run

# Custom directories
ai-testpilot generate --target ./lib --output ./spec
ai-testpilot generate --target ./components

# Complete workflow
ai-testpilot generate && ai-testpilot run && ai-testpilot report
```

## Team Project Recommended Usage

### Project Installation + npm scripts
```bash
# Project maintainer
npm install --save-dev ai-testpilot
```

Add to `package.json`:
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

Team members only need to:
```bash
# Generate test files
npm run test:generate

# Run tests
npm test

# View reports
npm run test:report

# One-click complete workflow
npm run test:all

# Generate tests only for components
npm run test:components
```

### CI/CD Integration
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

## Different Usage Scenarios

### Personal Projects
- **Recommended**: `npx ai-testpilot` one-time use
- **Advantage**: No installation required, available anytime

### Team Projects  
- **Recommended**: Project installation + npm scripts
- **Advantage**: Version consistency, easy collaboration

### Continuous Integration
- **Recommended**: Integrate into CI/CD pipeline
- **Advantage**: Automated testing, code quality assurance

## Features

✅ **Zero Configuration** - No need to install Jest, TypeScript, or other dependencies  
✅ **Smart Generation** - Automatically generates reasonable test cases based on source code  
✅ **Coverage Reports** - Automatically generates detailed test coverage  
✅ **Multiple Format Support** - JavaScript, TypeScript, React components  

## Generated Test Example

**Source File (src/utils.js)**
```javascript
export function add(a, b) {
  return a + b;
}

export function isEven(num) {
  return num % 2 === 0;
}
```

**Auto-generated Test (tests/utils.test.js)**  
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

## Supported Project Types

- Node.js projects
- React projects  
- TypeScript projects
- Mixed JS/TS projects

## FAQ

**Q: Do I need to modify my existing code?**  
A: No, ai-testpilot only generates test files and won't modify your source code.

**Q: Can I modify the generated test files?**  
A: Yes, you can modify the test cases as needed after generation.

**Q: Does it support projects with existing Jest configuration?**  
A: Yes, ai-testpilot will detect existing configuration and use it compatibly.

## 🤝 Contributing

Issues and Pull Requests are welcome!

## 🔗 Links

- [GitHub Repository](https://github.com/DianaLeoTang/testpilot)
- [NPM Package](https://npmjs.com/package/ai-testpilot)
- [Issue Tracker](https://github.com/DianaLeoTang/testpilot/issues)

---

### 📜 License

MIT © Diana Tang