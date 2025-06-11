/*
 * @Author: Diana Tang
 */
// index.ts - CLI 入口
import { findModules } from './src/scanner';
import { generateTests } from './src/generator';
import { runTests } from './src/runner';
import { generateReport } from './src/reporter';

const command = process.argv[2];

(async () => {
  switch (command) {
    case 'generate': {
      const files = findModules('src');
      generateTests(files);
      break;
    }
    case 'run': {
      await runTests();
      break;
    }
    case 'report': {
      generateReport();
      break;
    }
    default:
      console.log(`Usage: testpilot <generate|run|report>`);
  }
})();