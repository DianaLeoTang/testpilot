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

    // 分析源文件内容，提取导出的函数/类
    const sourceContent = fs.readFileSync(filePath, 'utf-8');
    const exports = extractExports(sourceContent);

    const content = generateTestContent(fileName, importPath, exports);

    fs.writeFileSync(outputPath, content);
    console.log(`✅ Generated test: ${outputPath}`);
  });
}

function extractExports(sourceContent: string): string[] {
  const exports: string[] = [];
  
  // 去除注释和字符串，避免误匹配
  const cleanContent = removeCommentsAndStrings(sourceContent);
  
  // 匹配 export function functionName
  const functionMatches = cleanContent.match(/export\s+function\s+(\w+)/g);
  if (functionMatches) {
    functionMatches.forEach(match => {
      const name = match.match(/function\s+(\w+)/)?.[1];
      if (name) exports.push(name);
    });
  }

  // 匹配 export const/let functionName = 
  const constMatches = cleanContent.match(/export\s+(?:const|let)\s+(\w+)\s*=/g);
  if (constMatches) {
    constMatches.forEach(match => {
      const name = match.match(/(?:const|let)\s+(\w+)/)?.[1];
      if (name) exports.push(name);
    });
  }

  // 匹配 export class ClassName
  const classMatches = cleanContent.match(/export\s+class\s+(\w+)/g);
  if (classMatches) {
    classMatches.forEach(match => {
      const name = match.match(/class\s+(\w+)/)?.[1];
      if (name) exports.push(name);
    });
  }

  // 匹配 export { name1, name2 } (更精确的匹配)
  const namedExportRegex = /export\s*\{\s*([^}]+)\s*\}/g;
  let match;
  while ((match = namedExportRegex.exec(cleanContent)) !== null) {
    const names = match[1];
    if (names) {
      // 分割并清理名称
      names.split(',').forEach(name => {
        const cleanName = name.trim().split(' as ')[0].trim();
        if (cleanName && /^\w+$/.test(cleanName)) { // 只允许有效的标识符
          exports.push(cleanName);
        }
      });
    }
  }

  return [...new Set(exports)]; // 去重
}

function removeCommentsAndStrings(code: string): string {
  // 简单移除单行注释、多行注释和字符串
  return code
    .replace(/\/\*[\s\S]*?\*\//g, '') // 移除 /* */ 注释
    .replace(/\/\/.*$/gm, '')         // 移除 // 注释
    .replace(/"[^"\\]*(?:\\.[^"\\]*)*"/g, '""')  // 移除双引号字符串
    .replace(/'[^'\\]*(?:\\.[^'\\]*)*'/g, "''")  // 移除单引号字符串
    .replace(/`[^`\\]*(?:\\.[^`\\]*)*`/g, '``'); // 移除模板字符串
}

function generateTestContent(fileName: string, importPath: string, exports: string[]): string {
  if (exports.length === 0) {
    // 如果没有找到导出，生成最基础的测试
    return `
describe('${fileName}', () => {
  it('should be importable without errors', () => {
    expect(() => {
      require('${importPath}');
    }).not.toThrow();
  });
});

// No exports detected in this file
// If there should be exports, check the source file and update imports manually
`.trimStart();
  }

  // 生成安全的导入测试
  const importStatement = `import { ${exports.join(', ')} } from '${importPath}';`;
  
  const testCases = exports.map(exportName => {
    return `
  describe('${exportName}', () => {
    it('should be defined', () => {
      expect(${exportName}).toBeDefined();
    });

    it('should be importable', () => {
      expect(typeof ${exportName}).toMatch(/function|object|string|number|boolean/);
    });

    // TODO: Add specific tests for ${exportName}
    // Example test patterns:
    // it('should return expected value', () => {
    //   const result = ${exportName}(/* add parameters */);
    //   expect(result).toBe(/* expected result */);
    // });
  });`;
  }).join('\n');

  return `
${importStatement}

describe('${fileName}', () => {${testCases}
});

// Generated tests for exports: ${exports.join(', ')}
// TODO: Replace basic tests with meaningful test cases
`.trimStart();
}

// 可选：更保守的版本，只生成导入测试
export function generateSafeTests(files: string[], testDir: string = 'tests') {
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

    // 生成最安全的测试：只测试模块可导入性
    const content = `
import * as ${fileName}Module from '${importPath}';

describe('${fileName}', () => {
  it('should be importable', () => {
    expect(${fileName}Module).toBeDefined();
  });

  it('should not throw when required', () => {
    expect(() => {
      require('${importPath}');
    }).not.toThrow();
  });
});

// This is a basic import test
// TODO: Add specific tests for the actual functions/classes in this module
// Check ${filePath} for available exports
`.trimStart();

    fs.writeFileSync(outputPath, content);
    console.log(`✅ Generated safe test: ${outputPath}`);
  });
}