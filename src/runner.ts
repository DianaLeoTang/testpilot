/*
 * @Author: Diana Tang
 */
import { exec } from "child_process";
import { promisify } from "util";
import path from "path";
import fs from 'fs';

const execAsync = promisify(exec);

export async function runTests() {
  try {
    const jestPath = path.resolve(__dirname, "../node_modules/.bin/jest");
    const configPath = path.resolve(__dirname, "../jest.config.js");
    if (!fs.existsSync(jestPath)) {
      console.error(
        "❌ Jest binary not found. Make sure dependencies are installed."
      );
      return;
    }
    const { stdout } = await execAsync(`${jestPath} --coverage --config ${configPath}`);
    console.log(stdout);
  } catch (error: any) {
    console.error("Test run failed:", error.stderr || error.message);
  }
}
