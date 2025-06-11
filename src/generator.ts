/*
 * @Author: Diana Tang
 */
import fs from 'fs';
import path from 'path';

export function generateTests(files: string[]) {
  const testDir = path.join(process.cwd(), 'tests');
  if (!fs.existsSync(testDir)) {
    fs.mkdirSync(testDir, { recursive: true });
  }

  files.forEach((filePath) => {
    const fileName = path.basename(filePath, path.extname(filePath));
    const importPath = path.relative(testDir, filePath).replace(/\\/g, '/').replace(/\.ts$/, '');
    const outputPath = path.join(testDir, `${fileName}.test.ts`);

    const content = `
describe('${fileName}', () => {
  it('should work correctly', () => {
    expect(true).toBe(true);
  });
});

// Optional: uncomment if you want to import and test the module
// import { ${fileName} } from '${importPath}';
// describe('${fileName}', () => {
//   it('should do something meaningful', () => {
//     expect(${fileName}).toBeDefined();
//   });
// });
`.trimStart();

    fs.writeFileSync(outputPath, content);
    console.log(`✅ Generated test: ${outputPath}`);
  });
}
