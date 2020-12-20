"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const get_bundles_1 = __importDefault(require("./get-bundles"));
const get_code_1 = __importDefault(require("./get-code"));
const get_const_1 = __importDefault(require("./get-const"));
exports.default = {
    getCode: get_code_1.default,
    getConst: get_const_1.default,
    getBundles: get_bundles_1.default,
};
