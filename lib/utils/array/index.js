"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function join(arr, sep) {
    return arr.filter(e => !!e).join(sep).trim();
}
function defined(arr) {
    return arr.filter(e => !!e);
}
function distinct(arr) {
    return arr.filter((e, i, a) => a.indexOf(e) === i);
}
exports.default = {
    join,
    defined,
    distinct,
};
