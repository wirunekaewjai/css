"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const to_ascii_1 = __importDefault(require("./to-ascii"));
const to_slug_1 = __importDefault(require("./to-slug"));
exports.default = {
    toAscii: to_ascii_1.default,
    toSlug: to_slug_1.default,
};
