import fs from 'fs';
import path from 'path';

interface FunctionInfo {
  name: string;
  params: Array<{name: string, type?: string, optional?: boolean}>;
  isAsync: boolean;
  returnType?: string;
  sourceCode: string;
}

interface ClassInfo {
  name: string;
  constructor?: {params: Array<{name: string, type?: string}>};
  methods: Array<{name: string, params: Array<{name: string, type?: string}>, isAsync: boolean}>;
}

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

    // 深度分析源文件
    const sourceContent = fs.readFileSync(filePath, 'utf-8');
    const analysis = analyzeSourceCode(sourceContent);

    const content = generateSmartTestContent(fileName, importPath, analysis);

    fs.writeFileSync(outputPath, content);
    console.log(`✅ Generated smart test: ${outputPath} (${analysis.functions.length} functions, ${analysis.classes.length} classes)`);
  });
}

function analyzeSourceCode(sourceContent: string): {
  functions: FunctionInfo[],
  classes: ClassInfo[],
  exports: string[]
} {
  const functions: FunctionInfo[] = [];
  const classes: ClassInfo[] = [];
  const exports: string[] = [];

  // 清理代码，移除注释和字符串
  const cleanContent = removeCommentsAndStrings(sourceContent);

  // 分析导出的函数
  const functionMatches = Array.from(cleanContent.matchAll(/export\s+(async\s+)?function\s+(\w+)\s*\(([^)]*)\)(?:\s*:\s*([^{]+))?\s*\{([^{}]*(?:\{[^{}]*\}[^{}]*)*)\}/g));
  
  for (const match of functionMatches) {
    const isAsync = !!match[1];
    const name = match[2];
    const paramsStr = match[3];
    const returnType = match[4]?.trim();
    const sourceCode = match[5];

    const params = parseParameters(paramsStr);
    
    functions.push({
      name,
      params,
      isAsync,
      returnType,
      sourceCode: sourceCode.substring(0, 200) // 限制长度避免过大
    });
    
    exports.push(name);
  }

  // 分析导出的 const/let 函数
  const constFunctionMatches = Array.from(cleanContent.matchAll(/export\s+const\s+(\w+)\s*=\s*(async\s+)?\(([^)]*)\)\s*(?::\s*([^=]+?))?\s*=>\s*\{?([^;]*)/g));
  
  for (const match of constFunctionMatches) {
    const name = match[1];
    const isAsync = !!match[2];
    const paramsStr = match[3];
    const returnType = match[4]?.trim();
    const sourceCode = match[5];

    const params = parseParameters(paramsStr);
    
    functions.push({
      name,
      params,
      isAsync,
      returnType,
      sourceCode: sourceCode.substring(0, 200)
    });
    
    exports.push(name);
  }

  // 分析类
  const classMatches = Array.from(cleanContent.matchAll(/export\s+class\s+(\w+)(?:\s+extends\s+\w+)?\s*\{([^{}]*(?:\{[^{}]*\}[^{}]*)*)\}/g));
  
  for (const match of classMatches) {
    const name = match[1];
    const classBody = match[2];
    
    // 分析构造函数
    const constructorMatch = classBody.match(/constructor\s*\(([^)]*)\)/);
    const constructorParams = constructorMatch ? parseParameters(constructorMatch[1]) : [];
    
    // 分析方法
    const methodMatches = Array.from(classBody.matchAll(/(async\s+)?(\w+)\s*\(([^)]*)\)/g));
    const methods = methodMatches
      .filter(m => m[2] !== 'constructor')
      .map(m => ({
        name: m[2],
        params: parseParameters(m[3]),
        isAsync: !!m[1]
      }));

    classes.push({
      name,
      constructor: constructorParams.length > 0 ? {params: constructorParams} : undefined,
      methods
    });
    
    exports.push(name);
  }

  return { functions, classes, exports: [...new Set(exports)] };
}

function parseParameters(paramsStr: string): Array<{name: string, type?: string, optional?: boolean}> {
  if (!paramsStr.trim()) return [];
  
  return paramsStr.split(',').map(param => {
    const trimmed = param.trim();
    const optional = trimmed.includes('?');
    const [nameType] = trimmed.split('='); // 移除默认值
    const [name, type] = nameType.split(':').map(s => s.trim().replace('?', ''));
    
    return {
      name: name || 'param',
      type: type,
      optional
    };
  }).filter(p => p.name);
}

function generateSmartTestContent(
  fileName: string, 
  importPath: string, 
  analysis: {functions: FunctionInfo[], classes: ClassInfo[], exports: string[]}
): string {
  if (analysis.exports.length === 0) {
    return generateBasicModuleTest(fileName, importPath);
  }

  const imports = analysis.exports.join(', ');
  const importStatement = `import { ${imports} } from '${importPath}';`;

  let testContent = importStatement + '\n\n';
  testContent += `describe('${fileName}', () => {\n`;

  // 为每个函数生成智能测试
  for (const func of analysis.functions) {
    testContent += generateFunctionTests(func);
  }

  // 为每个类生成测试
  for (const cls of analysis.classes) {
    testContent += generateClassTests(cls);
  }

  testContent += '});\n';

  return testContent;
}

function generateFunctionTests(func: FunctionInfo): string {
  const testCases = generateTestCases(func);
  const asyncPrefix = func.isAsync ? 'async ' : '';
  const awaitPrefix = func.isAsync ? 'await ' : '';

  let content = `\n  describe('${func.name}', () => {\n`;
  
  // 基础存在性测试
  content += `    it('should be defined', () => {\n`;
  content += `      expect(${func.name}).toBeDefined();\n`;
  content += `      expect(typeof ${func.name}).toBe('function');\n`;
  content += `    });\n\n`;

  // 智能测试用例
  for (const testCase of testCases) {
    content += `    it('${testCase.description}', ${asyncPrefix}() => {\n`;
    
    if (testCase.expectError) {
      content += `      ${func.isAsync ? 'await ' : ''}expect(${asyncPrefix}() => ${awaitPrefix}${func.name}(${testCase.args})).${func.isAsync ? 'rejects.' : ''}toThrow();\n`;
    } else {
      // 检查是否为副作用函数
      if (isSideEffectFunction(func)) {
        content += `      expect(() => ${func.name}(${testCase.args})).not.toThrow();\n`;
      } else {
        content += `      const result = ${awaitPrefix}${func.name}(${testCase.args});\n`;
        content += `      ${testCase.assertion}\n`;
      }
    }
    
    content += `    });\n\n`;
  }

  content += `  });\n`;
  return content;
}

function generateTestCases(func: FunctionInfo): Array<{
  description: string,
  args: string,
  assertion: string,
  expectError?: boolean
}> {
  const cases: Array<{description: string, args: string, assertion: string, expectError?: boolean}> = [];

  if (func.params.length === 0) {
    // 无参数函数 - 检查是否为副作用函数
    if (isSideEffectFunction(func)) {
      cases.push({
        description: 'should execute without throwing errors',
        args: '',
        assertion: 'expect(() => result).not.toThrow();'
      });
    } else {
      cases.push({
        description: 'should work when called without parameters',
        args: '',
        assertion: determineReturnAssertion(func)
      });
    }
  } else {
    // 根据参数类型生成测试用例
    const testData = generateTestData(func.params);
    
    // 正常情况测试
    cases.push({
      description: 'should work with valid parameters',
      args: testData.valid.join(', '),
      assertion: inferAssertion(func)
    });

    // 边界值测试
    if (testData.boundary.length > 0) {
      cases.push({
        description: 'should handle boundary values',
        args: testData.boundary.join(', '),
        assertion: 'expect(result).toBeDefined();'
      });
    }

    // 错误情况测试
    if (testData.invalid.length > 0 && !func.params.every(p => p.optional)) {
      cases.push({
        description: 'should handle invalid parameters',
        args: testData.invalid.join(', '),
        assertion: '',
        expectError: true
      });
    }

    // 类型特定测试
    if (func.name.toLowerCase().includes('add') || func.name.toLowerCase().includes('sum')) {
      cases.push({
        description: 'should add numbers correctly',
        args: '2, 3',
        assertion: 'expect(result).toBe(5);'
      });
    }

    if (func.name.toLowerCase().includes('multiply')) {
      cases.push({
        description: 'should multiply numbers correctly',
        args: '4, 5',
        assertion: 'expect(result).toBe(20);'
      });
    }

    if (func.name.toLowerCase().includes('format') || func.name.toLowerCase().includes('string')) {
      cases.push({
        description: 'should return a string',
        args: testData.valid.join(', '),
        assertion: 'expect(typeof result).toBe(\'string\');'
      });
    }

    if (func.name.toLowerCase().includes('array') || func.name.toLowerCase().includes('list')) {
      cases.push({
        description: 'should return an array',
        args: testData.valid.join(', '),
        assertion: 'expect(Array.isArray(result)).toBe(true);'
      });
    }
  }

  return cases;
}

function generateTestData(params: Array<{name: string, type?: string, optional?: boolean}>): {
  valid: string[],
  boundary: string[],
  invalid: string[]
} {
  const valid: string[] = [];
  const boundary: string[] = [];
  const invalid: string[] = [];

  for (const param of params) {
    const type = param.type?.toLowerCase();

    if (type?.includes('string')) {
      valid.push(`'test'`);
      boundary.push(`''`);
      invalid.push(`null`);
    } else if (type?.includes('number')) {
      valid.push(`42`);
      boundary.push(`0`);
      invalid.push(`NaN`);
    } else if (type?.includes('boolean')) {
      valid.push(`true`);
      boundary.push(`false`);
      invalid.push(`null`);
    } else if (type?.includes('array')) {
      valid.push(`[1, 2, 3]`);
      boundary.push(`[]`);
      invalid.push(`null`);
    } else if (type?.includes('object')) {
      valid.push(`{id: 1}`);
      boundary.push(`{}`);
      invalid.push(`null`);
    } else {
      // 未知类型，使用通用值
      valid.push(`'testValue'`);
      boundary.push(`null`);
      invalid.push(`undefined`);
    }
  }

  return { valid, boundary, invalid };
}

function inferAssertion(func: FunctionInfo): string {
  const name = func.name.toLowerCase();
  const returnType = func.returnType?.toLowerCase();

  if (returnType?.includes('string')) {
    return "expect(typeof result).toBe('string');";
  }
  if (returnType?.includes('number')) {
    return "expect(typeof result).toBe('number');";
  }
  if (returnType?.includes('boolean')) {
    return "expect(typeof result).toBe('boolean');";
  }
  if (returnType?.includes('array')) {
    return "expect(Array.isArray(result)).toBe(true);";
  }

  // 基于函数名推断
  if (name.includes('is') || name.includes('has') || name.includes('can')) {
    return "expect(typeof result).toBe('boolean');";
  }
  if (name.includes('get') || name.includes('find')) {
    return "expect(result).toBeDefined();";
  }
  if (name.includes('count') || name.includes('length')) {
    return "expect(typeof result).toBe('number');";
  }

  return "expect(result).toBeDefined();";
}

function generateClassTests(cls: ClassInfo): string {
  let content = `\n  describe('${cls.name}', () => {\n`;
  
  // 类存在性测试
  content += `    it('should be defined', () => {\n`;
  content += `      expect(${cls.name}).toBeDefined();\n`;
  content += `    });\n\n`;

  // 实例化测试
  const constructorArgs = cls.constructor 
    ? generateTestData(cls.constructor.params).valid.join(', ')
    : '';
    
  content += `    it('should be instantiable', () => {\n`;
  content += `      const instance = new ${cls.name}(${constructorArgs});\n`;
  content += `      expect(instance).toBeInstanceOf(${cls.name});\n`;
  content += `    });\n\n`;

  // 方法测试
  for (const method of cls.methods) {
    const methodArgs = generateTestData(method.params).valid.join(', ');
    const asyncPrefix = method.isAsync ? 'async ' : '';
    const awaitPrefix = method.isAsync ? 'await ' : '';

    content += `    describe('${method.name}', () => {\n`;
    content += `      it('should be defined', ${asyncPrefix}() => {\n`;
    content += `        const instance = new ${cls.name}(${constructorArgs});\n`;
    content += `        expect(instance.${method.name}).toBeDefined();\n`;
    content += `        expect(typeof instance.${method.name}).toBe('function');\n`;
    content += `      });\n\n`;
    
    content += `      it('should work when called', ${asyncPrefix}() => {\n`;
    content += `        const instance = new ${cls.name}(${constructorArgs});\n`;
    content += `        const result = ${awaitPrefix}instance.${method.name}(${methodArgs});\n`;
    content += `        expect(result).toBeDefined();\n`;
    content += `      });\n`;
    content += `    });\n\n`;
  }

  content += `  });\n`;
  return content;
}

function generateBasicModuleTest(fileName: string, importPath: string): string {
  return `
import * as ${fileName}Module from '${importPath}';

describe('${fileName}', () => {
  it('should be importable', () => {
    expect(${fileName}Module).toBeDefined();
  });

  it('should not throw when imported', () => {
    expect(() => require('${importPath}')).not.toThrow();
  });
});

// No exports detected - this module might have side effects or be a utility module
`.trimStart();
}

function removeCommentsAndStrings(code: string): string {
  return code
    .replace(/\/\*[\s\S]*?\*\//g, ' ')
    .replace(/\/\/.*$/gm, '')
    .replace(/"[^"\\]*(?:\\.[^"\\]*)*"/g, '""')
    .replace(/'[^'\\]*(?:\\.[^'\\]*)*'/g, "''")
    .replace(/`[^`\\]*(?:\\.[^`\\]*)*`/g, '``');
}

function isSideEffectFunction(func: FunctionInfo): boolean {
  const code = func.sourceCode.toLowerCase();
  const returnType = func.returnType?.toLowerCase();
  
  // 1. 明确的 void 返回类型
  if (returnType === 'void') {
    return true;
  }
  
  // 2. 检查是否有明确的 return 语句返回值
  const hasReturnValue = /return\s+(?!;|$)/.test(code);
  if (!hasReturnValue) {
    return true;
  }
  
  // 3. 检查是否只有 early return（提前返回，但不返回有意义的值）
  const returnMatches = code.match(/return\s*([^;]+)?/g) || [];
  const meaningfulReturns = returnMatches.filter(returnStmt => {
    const value = returnStmt.replace('return', '').trim().replace(';', '');
    // 排除空返回、undefined、null、空字符串
    return value && 
           value !== 'undefined' && 
           value !== 'null' && 
           value !== '""' && 
           value !== "''" && 
           value !== 'void 0';
  });
  
  if (meaningfulReturns.length === 0) {
    return true;
  }
  
  // 4. 检查代码中是否有副作用操作（通用模式）
  const sideEffectPatterns = [
    /console\./,           // 任何 console 操作
    /\.log\(/,             // 任何 .log() 调用
    /\.write\(/,           // 文件写入
    /\.create\(/,          // 创建操作
    /\.save\(/,            // 保存操作
    /\.delete\(/,          // 删除操作
    /\.remove\(/,          // 移除操作
    /\.appendChild\(/,     // DOM 操作
    /\.innerHTML/,         // DOM 修改
    /\.style\./,           // 样式修改
    /process\.exit/,       // 进程控制
    /throw\s+/,            // 抛出异常
    /alert\(/,             // 弹窗
    /confirm\(/,           // 确认框
    /document\./,          // DOM 操作
    /window\./,            // 窗口操作
    /localStorage/,        // 本地存储
    /sessionStorage/,      // 会话存储
    /fetch\(/,             // 网络请求
    /axios\./,             // HTTP 请求
    /xhr\./,               // XMLHttpRequest
    /socket\./,            // Socket 操作
    /emit\(/,              // 事件触发
    /dispatch\(/,          // 状态派发
    /setState\(/,          // React 状态设置
    /\.push\(/,            // 数组修改
    /\.pop\(/,             // 数组修改
    /\.splice\(/,          // 数组修改
    /\.sort\(/,            // 数组排序（会修改原数组）
    /\.reverse\(/          // 数组反转（会修改原数组）
  ];
  
  return sideEffectPatterns.some(pattern => pattern.test(code));
}

function determineReturnAssertion(func: FunctionInfo): string {
  const returnType = func.returnType?.toLowerCase();
  const code = func.sourceCode.toLowerCase();

  // 1. 基于 TypeScript 返回类型
  if (returnType) {
    if (returnType.includes('void') || returnType === 'undefined') {
      return 'expect(result).toBeUndefined();';
    }
    if (returnType.includes('string')) {
      return "expect(typeof result).toBe('string');";
    }
    if (returnType.includes('number')) {
      return "expect(typeof result).toBe('number');";
    }
    if (returnType.includes('boolean')) {
      return "expect(typeof result).toBe('boolean');";
    }
    if (returnType.includes('array') || returnType.includes('[]')) {
      return "expect(Array.isArray(result)).toBe(true);";
    }
    if (returnType.includes('object')) {
      return "expect(typeof result).toBe('object'); expect(result).not.toBeNull();";
    }
    if (returnType.includes('promise')) {
      return "expect(result).toBeInstanceOf(Promise);";
    }
  }

  // 2. 分析代码中的 return 语句
  const returnMatches = code.match(/return\s+([^;]+)/g) || [];
  
  if (returnMatches.length === 0) {
    return 'expect(result).toBeUndefined();';
  }

  // 分析返回值的模式
  const returnValues = returnMatches.map(stmt => 
    stmt.replace('return', '').trim().replace(';', '')
  );

  // 检查返回值类型模式
  const hasStringReturn = returnValues.some(val => 
    val.startsWith('"') || val.startsWith("'") || val.startsWith('`') ||
    val.includes('.toString()') || val.includes('string')
  );
  
  const hasNumberReturn = returnValues.some(val => 
    /^\d+$/.test(val) || val.includes('math.') || val.includes('number') ||
    /[+\-*/]/.test(val) && !/['"`]/.test(val)
  );
  
  const hasBooleanReturn = returnValues.some(val => 
    val === 'true' || val === 'false' || val.includes('boolean') ||
    /===|!==|==|!=|<|>|<=|>=/.test(val)
  );
  
  const hasArrayReturn = returnValues.some(val => 
    val.startsWith('[') || val.includes('.map(') || val.includes('.filter(') ||
    val.includes('array') || val.includes('[]')
  );
  
  const hasObjectReturn = returnValues.some(val => 
    val.startsWith('{') || val.includes('object') || val.includes('new ')
  );

  // 根据检测到的模式返回断言
  if (hasStringReturn) {
    return "expect(typeof result).toBe('string');";
  }
  if (hasNumberReturn) {
    return "expect(typeof result).toBe('number');";
  }
  if (hasBooleanReturn) {
    return "expect(typeof result).toBe('boolean');";
  }
  if (hasArrayReturn) {
    return "expect(Array.isArray(result)).toBe(true);";
  }
  if (hasObjectReturn) {
    return "expect(typeof result).toBe('object'); expect(result).not.toBeNull();";
  }

  // 3. 通用检查：如果有返回值，至少应该不是 undefined
  const hasActualReturn = returnValues.some(val => 
    val && val !== 'undefined' && val !== 'null' && val !== '""' && val !== "''"
  );

  if (hasActualReturn) {
    return "expect(result).toBeDefined();";
  }

  // 4. 默认情况：可能是副作用函数
  return 'expect(result).toBeUndefined();';
}