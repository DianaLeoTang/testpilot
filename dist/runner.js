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
const fs_1 = __importDefault(require("fs"));
const execAsync = (0, util_1.promisify)(child_process_1.exec);
async function runTests() {
    try {
        const jestPath = path_1.default.resolve(__dirname, "../node_modules/.bin/jest");
        const configPath = path_1.default.resolve(__dirname, "../jest.default.config.js");
        if (!fs_1.default.existsSync(jestPath)) {
            console.error("❌ Jest binary not found. Make sure dependencies are installed.");
            return;
        }
        const { stdout } = await execAsync(`${jestPath} --coverage --config ${configPath}`);
        console.log(stdout);
    }
    catch (error) {
        console.error("Test run failed:", error.stderr || error.message);
    }
}
