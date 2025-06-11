/*
 * @Author: Diana Tang
 */
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export async function runTests() {
  try {
    const { stdout } = await execAsync('npx jest --coverage');
    console.log(stdout);
  } catch (error: any) {
    console.error('Test run failed:', error.stderr || error.message);
  }
}