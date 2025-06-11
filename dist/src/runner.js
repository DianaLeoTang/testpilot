"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.runTests = runTests;
/*
 * @Author: Diana Tang
 */
const child_process_1 = require("child_process");
const util_1 = require("util");
const execAsync = (0, util_1.promisify)(child_process_1.exec);
async function runTests() {
    try {
        const { stdout } = await execAsync('npx jest --coverage');
        console.log(stdout);
    }
    catch (error) {
        console.error('Test run failed:', error.stderr || error.message);
    }
}
