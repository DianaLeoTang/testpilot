
import { findModules } from './scanner';
import { generateTests } from './generator';
import { runTests } from './runner';
import { generateReport } from './reporter';
import path from 'path';


const command = process.argv[2];
const args = process.argv.slice(3); // e.g. ["--target", "./src"]
// Simple CLI arg parsing
const argMap = args.reduce((map, val, idx, arr) => {
  if (val.startsWith('--')) {
    map[val.slice(2)] = arr[idx + 1];
  }
  return map;
}, {} as Record<string, string>);

const targetDir = argMap.target || 'src';
const testDir = argMap.output || 'tests';

(async () => {
  switch (command) {
    case 'generate': {
      const absPath = path.resolve(process.cwd(), targetDir);
      const files = findModules(absPath);
      if (!files.length) {
        console.warn(`⚠️ No .ts or .js files found in ${absPath}`);
        return;
      }
      generateTests(files, testDir);
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

    default: {
      console.log(`
Usage:
  testpilot generate --target ./src       # Scan and generate tests
  testpilot run                            # Run tests
  testpilot report                         # Show report location

Options:
  --target <dir>    Target source directory (default: ./src)
  --output <dir>    Output test directory (default: ./tests)
`);
    }
  }
})();