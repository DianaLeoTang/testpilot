/*
 * @Author: Diana Tang
 */
import { exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';

const execAsync = promisify(exec);

export async function runTests() {
  try {
    const jestPath = path.resolve(__dirname, '../node_modules/.bin/jest');
    const { stdout } = await execAsync(`${jestPath} --coverage`);
    console.log(stdout);
  } catch (error: any) {
    console.error('Test run failed:', error.stderr || error.message);
  }
}