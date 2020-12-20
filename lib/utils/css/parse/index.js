"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function parse(css) {
    const rework = require('rework');
    const dst = rework(css).obj;
    return dst;
}
exports.default = parse;
