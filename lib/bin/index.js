#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const yargs_1 = __importDefault(require("yargs/yargs"));
const init_1 = __importDefault(require("../init"));
const build_1 = __importDefault(require("../build"));
const cli = yargs_1.default(process.argv.slice(2))
    .command('init', 'initialize css config file')
    .command('build', 'build css file from source', (_) => {
    return _
        .option('config', {
        alias: 'c',
        describe: 'config file',
        demandOption: false,
        type: 'string',
    })
        .option('watch', {
        alias: 'w',
        describe: 'watch',
        demandOption: false,
        type: 'boolean',
    });
})
    .help();
const { _, $0, ...args } = cli.argv;
const command = _[0];
if (command === 'init') {
    init_1.default();
}
else if (command === 'build') {
    build_1.default(args);
}
else {
    cli.showHelp();
}
