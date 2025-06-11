/*
 * @Author: Diana Tang
 */
import fs from 'fs';
import path from 'path';

export function findModules(dir: string): string[] {
  const results: string[] = [];
  const items = fs.readdirSync(dir);
  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      results.push(...findModules(fullPath));
    } else if (item.endsWith('.ts') || item.endsWith('.js')) {
      results.push(fullPath);
    }
  }
  return results;
}