"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const get_code_1 = __importDefault(require("./get-code"));
function evaluate(file, externals) {
    const code = get_code_1.default(file, externals);
    if (!code) {
        return [];
    }
    const paths = [];
    code.replace(/(\/\/\s).*(.ts|.js|.tsx|.jsx)/g, (a) => {
        paths.push(a.slice(3));
        return a;
    });
    return paths;
}
exports.default = evaluate;
