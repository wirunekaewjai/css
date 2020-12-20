"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const nanoid_1 = require("nanoid");
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const get_code_1 = __importDefault(require("./get-code"));
function evaluate(file, name, externals) {
    const code = get_code_1.default(file, externals);
    if (!code) {
        return undefined;
    }
    const moduleID = path_1.default.resolve(path_1.default.join('.', nanoid_1.nanoid()));
    const modulePath = moduleID + '.js';
    fs_1.default.writeFileSync(modulePath, code);
    try {
        const module = require(moduleID);
        const data = module[name];
        fs_1.default.unlinkSync(modulePath);
        return data;
    }
    catch (err) {
        console.error(err);
        if (fs_1.default.existsSync(modulePath)) {
            fs_1.default.unlinkSync(modulePath);
        }
    }
    return undefined;
}
exports.default = evaluate;
