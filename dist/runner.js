"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.runTests = runTests;
/*
 * @Author: Diana Tang
 */
const child_process_1 = require("child_process");
const util_1 = require("util");
const path_1 = __importDefault(require("path"));
const execAsync = (0, util_1.promisify)(child_process_1.exec);
async function runTests() {
    try {
        const jestPath = path_1.default.resolve(__dirname, '../node_modules/.bin/jest');
        const { stdout } = await execAsync(`${jestPath} --coverage`);
        console.log(stdout);
    }
    catch (error) {
        console.error('Test run failed:', error.stderr || error.message);
    }
}
