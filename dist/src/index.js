"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const scanner_1 = require("./scanner");
const generator_1 = require("./generator");
const runner_1 = require("./runner");
const reporter_1 = require("./reporter");
const path_1 = __importDefault(require("path"));
const command = process.argv[2];
const args = process.argv.slice(3); // e.g. ["--target", "./src"]
// Simple CLI arg parsing
const argMap = args.reduce((map, val, idx, arr) => {
    if (val.startsWith('--')) {
        map[val.slice(2)] = arr[idx + 1];
    }
    return map;
}, {});
const targetDir = argMap.target || 'src';
const testDir = argMap.output || 'tests';
(async () => {
    switch (command) {
        case 'generate': {
            const absPath = path_1.default.resolve(process.cwd(), targetDir);
            const files = (0, scanner_1.findModules)(absPath);
            if (!files.length) {
                console.warn(`⚠️ No .ts or .js files found in ${absPath}`);
                return;
            }
            (0, generator_1.generateTests)(files, testDir);
            break;
        }
        case 'run': {
            await (0, runner_1.runTests)();
            break;
        }
        case 'report': {
            (0, reporter_1.generateReport)();
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
