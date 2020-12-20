"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function toSlug(raw = '') {
    return raw.replace(/[^A-Za-z0-9]+/g, ' ').trim().replace(/\s+/g, '-');
}
exports.default = toSlug;
