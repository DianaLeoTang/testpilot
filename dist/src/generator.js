"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateTests = generateTests;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
function generateTests(files, testDir = 'tests') {
    if (!fs_1.default.existsSync(testDir)) {
        fs_1.default.mkdirSync(testDir, { recursive: true });
    }
    files.forEach((filePath) => {
        const fileName = path_1.default.basename(filePath, path_1.default.extname(filePath));
        const importPath = path_1.default
            .relative(testDir, filePath)
            .replace(/\\/g, '/')
            .replace(/\.ts$/, '')
            .replace(/\.js$/, '');
        const outputPath = path_1.default.join(testDir, `${fileName}.test.ts`);
        const content = `
describe('${fileName}', () => {
  it('should work correctly', () => {
    expect(true).toBe(true);
  });
});

// import { ${fileName} } from '${importPath}';
// Add actual test logic above
`.trimStart();
        fs_1.default.writeFileSync(outputPath, content);
        console.log(`✅ Generated test: ${outputPath}`);
    });
}
