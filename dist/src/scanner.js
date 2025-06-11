"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.findModules = findModules;
/*
 * @Author: Diana Tang
 */
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
function findModules(dir) {
    const results = [];
    const items = fs_1.default.readdirSync(dir);
    for (const item of items) {
        const fullPath = path_1.default.join(dir, item);
        const stat = fs_1.default.statSync(fullPath);
        if (stat.isDirectory()) {
            results.push(...findModules(fullPath));
        }
        else if (item.endsWith('.ts') || item.endsWith('.js')) {
            results.push(fullPath);
        }
    }
    return results;
}
