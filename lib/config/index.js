"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function create(input) {
    const out = {
        source: {
            directory: input.source.directory,
        },
        module: {
            input: {
                extension: input.module.input.extension,
            },
            output: {
                extension: input.module.output.extension,
            },
        },
        build: {
            directory: input.build.directory,
            entries: input.build.entries,
        },
    };
    return out;
}
exports.default = create;
