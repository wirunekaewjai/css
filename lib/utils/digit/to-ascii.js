"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const alpha = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
function toAscii(n) {
    if (n === 0) {
        return alpha[0];
    }
    const length = alpha.length;
    let remain = n;
    let result = '';
    while (remain > 0) {
        const d = Math.floor(remain / length);
        const m = remain % length;
        remain = d;
        result = alpha[m] + result;
    }
    return result;
}
exports.default = toAscii;
