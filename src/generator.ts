import fs from 'fs';
import path from 'path';

export function generateTests(files: string[], testDir: string = 'tests') {
  if (!fs.existsSync(testDir)) {
    fs.mkdirSync(testDir, { recursive: true });
  }

  files.forEach((filePath) => {
    const fileName = path.basename(filePath, path.extname(filePath));
    const importPath = path
      .relative(testDir, filePath)
      .replace(/\\/g, '/')
      .replace(/\.ts$/, '')
      .replace(/\.js$/, '');

    const outputPath = path.join(testDir, `${fileName}.test.ts`);

    const content = `
describe('${fileName}', () => {
  it('should work correctly', () => {
    expect(true).toBe(true);
  });
});

// import { ${fileName} } from '${importPath}';
// Add actual test logic above
`.trimStart();

    fs.writeFileSync(outputPath, content);
    console.log(`✅ Generated test: ${outputPath}`);
  });
}
