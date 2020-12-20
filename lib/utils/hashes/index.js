"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const hasha = __importStar(require("hasha"));
class Hashes {
    constructor() {
        this.map = {};
    }
    hasChanged(filePath) {
        if (!fs_1.default.existsSync(filePath)) {
            return false;
        }
        if (!this.map[filePath]) {
            return true;
        }
        const hash = hasha.fromFileSync(filePath, { algorithm: 'sha1' }) ?? '';
        return this.map[filePath] !== hash;
    }
    setChanged(filePath) {
        if (!fs_1.default.existsSync(filePath) && this.map[filePath]) {
            delete this.map[filePath];
        }
        if (fs_1.default.existsSync(filePath)) {
            const hash = hasha.fromFileSync(filePath, { algorithm: 'sha1' });
            if (hash) {
                this.map[filePath] = hash;
            }
        }
    }
}
exports.default = Hashes;
