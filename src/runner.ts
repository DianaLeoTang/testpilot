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
      console.error("❌ Jest binary not found. Make sure dependencies are installed.");
      return;
    }
    
    if (!fs.existsSync(configPath)) {
      console.error("❌ Jest config not found.");
      return;
    }
    
    console.log("🚀 Running tests...");
    
    const { stdout, stderr } = await execAsync(`"${jestPath}" --coverage --config "${configPath}"`, {
      cwd: process.cwd(),
      maxBuffer: 1024 * 1024 * 10 // 10MB buffer
    });
    
    console.log(stdout);
    if (stderr) {
      console.log('STDERR:', stderr);
    }
  } catch (error: any) {
    console.error("Test run failed:");
    if (error.stdout) {
      console.log(error.stdout);
    }
    if (error.stderr) {
      console.error(error.stderr);
    }
  }
}