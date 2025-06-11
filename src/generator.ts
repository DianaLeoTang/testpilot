/*
 * @Author: Diana Tang
 */
import fs from 'fs';
import path from 'path';

export function generateTests(files: string[]) {
  const template = fs.readFileSync('templates/jest.test.stub.ts', 'utf-8');
  // 👉 确保 tests 目录存在
  const testDir = path.join(process.cwd(), 'tests');
  if (!fs.existsSync(testDir)) {
    fs.mkdirSync(testDir, { recursive: true });
  }
  files.forEach((filePath) => {
    const fileName = path.basename(filePath, path.extname(filePath));
    const outputPath = path.join('tests', `${fileName}.test.ts`);
    const content = template
      .replace(/\$MODULE_NAME/g, fileName)
      .replace(/\$MODULE_PATH/g, filePath.replace(/\\/g, '/'));
    fs.writeFileSync(outputPath, content);
    console.log(`Generated test for ${filePath}`);
  });
}