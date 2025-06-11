"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateReport = generateReport;
/*
 * @Author: Diana Tang
 */
const fs_1 = __importDefault(require("fs"));
function generateReport() {
    const reportPath = 'coverage/lcov-report/index.html';
    if (fs_1.default.existsSync(reportPath)) {
        console.log(`HTML coverage report generated: ${reportPath}`);
    }
    else {
        console.warn('No report found. Please run tests first.');
    }
}
