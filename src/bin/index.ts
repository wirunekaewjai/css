#!/usr/bin/env node
import yargs from 'yargs/yargs';

import init from '../init';
import build from '../build';

const cli = yargs(process.argv.slice(2))
  .command('init', 'initialize css config file')
  .command('build', 'build css file from source', (_) =>
  {
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

if (command === 'init')
{
  init();
}
else if (command === 'build')
{
  build(args);
}
else
{
  cli.showHelp();
}