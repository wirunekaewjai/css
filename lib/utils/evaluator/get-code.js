"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const esbuild_1 = require("esbuild");
const nanoid_1 = require("nanoid");
const fs_1 = require("fs");
const path_1 = require("path");
function createTempName(file) {
    const id = nanoid_1.nanoid();
    const p = path_1.parse(file);
    const dir = p.dir;
    const dst = path_1.join(dir, p.name + '.' + id + '.temp' + p.ext);
    return dst;
}
function createTempFile(src, dst) {
    const srcCode = fs_1.readFileSync(src).toString('utf8');
    const dstCode = srcCode.replace(/import\s*('|")[^'"]+('|")/g, t => '// ' + t);
    fs_1.writeFileSync(dst, dstCode);
}
function evaluate(file, externals) {
    const dst = createTempName(file);
    try {
        createTempFile(file, dst);
        const result = esbuild_1.buildSync({
            bundle: true,
            platform: 'node',
            external: externals,
            entryPoints: [dst],
            write: false,
        });
        const code = result?.outputFiles?.[0]?.text ?? '';
        if (fs_1.existsSync(dst)) {
            fs_1.unlinkSync(dst);
        }
        return code;
    }
    catch (err) {
        console.error(err);
        if (fs_1.existsSync(dst)) {
            fs_1.unlinkSync(dst);
        }
    }
}
exports.default = evaluate;
