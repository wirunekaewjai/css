"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const digit_1 = __importDefault(require("../digit"));
class Incremental {
    constructor() {
        this.ids = {};
        this.increment = 0;
    }
    get(key) {
        const ids = this.ids;
        if (!ids[key]) {
            ids[key] = digit_1.default.toAscii(this.increment++);
        }
        return ids[key];
    }
}
exports.default = Incremental;
