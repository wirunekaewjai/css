"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
function run() {
    const path = 'wkcss.config.ts';
    if (fs_1.default.existsSync(path)) {
        console.error(`config file "${path}" already exists`);
        return;
    }
    const template = require('./template');
    const text = template.default;
    fs_1.default.writeFileSync(path, text);
    console.error(`create config file "${path}" successfully`);
}
exports.default = run;
