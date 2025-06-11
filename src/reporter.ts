/*
 * @Author: Diana Tang
 */
import fs from 'fs';

export function generateReport() {
  const reportPath = 'coverage/lcov-report/index.html';
  if (fs.existsSync(reportPath)) {
    console.log(`HTML coverage report generated: ${reportPath}`);
  } else {
    console.warn('No report found. Please run tests first.');
  }
}