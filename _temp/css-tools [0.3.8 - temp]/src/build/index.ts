import chokidar, { FSWatcher } from 'chokidar';
import glob from 'glob';
import path from 'path';
import fs from 'fs';

import sass from 'sass';

import * as hasha from 'hasha';

import evaluator from '../utils/evaluator';

import Hashes from '../utils/hashes';
import Incremental from '../utils/incremental';

import { Config } from '../config/types';
import { Args, Generic } from './types';

//
import readCSSFromFile from '../utils/css/from-file';
//

let config: Config;
let packages: string[];
let watchers: FSWatcher[];

let names: Incremental;
let hashes: Hashes;

let entries: Generic<string[]>;
let entryReverses: Generic<string>;
let entryOuts: string[];

let dependencies: Generic<string[]>;
let dependencyReverses: Generic<string[]>;

export default function run (args: Args)
{
  function initPackages ()
  {
    packages = [];

    if (!fs.existsSync('package.json'))
    {
      return;
    }

    const file = fs.readFileSync('package.json')?.toString('utf8');
    const json = JSON.parse(file);
    
    if (json.dependencies && typeof json.dependencies === 'object')
    {
      for (const pck of Object.keys(json.dependencies))
      {
        packages.push(pck);
      }
    }

    if (json.devDependencies && typeof json.devDependencies === 'object')
    {
      for (const pck of Object.keys(json.devDependencies))
      {
        packages.push(pck);
      }
    }
  }

  const configPath = args.config ?? 'wkstyle.config.ts';

  if (!fs.existsSync(configPath))
  {
    console.error('config file not founded');
    process.exit(1);
  }

  config = evaluator.getConst(configPath, 'default');

  if (!config)
  {
    console.error('invalid config');
    process.exit(1);
  }

  initPackages();
  init();

  build();

  if (args.watch)
  {
    function watchPackages ()
    {
      const watcher = chokidar.watch('package.json');

      watcher.on('change', () => 
      {
        initPackages();
      });
    }

    function watchConfig ()
    {
      const watcher = chokidar.watch(configPath);

      watcher.on('change', () => 
      {
        config = evaluator.getConst(configPath, 'default');

        if (!config)
        {
          console.error('invalid config');
          process.exit(1);
        }
    
        init();

        // watchEntries();
        // watchFiles();
        // watchModules();
      });

      watcher.on('unlink', () => 
      {
        process.exit(1);
      });
    }

    watchPackages();
    watchConfig();
  }
}

function init ()
{
  initWatchers();
  initEntries();

  names = new Incremental();
  hashes = new Hashes();
  
  dependencies = {};
  dependencyReverses = {};

  collectEntriesDependencies();
  // collectFiles();
}

function initWatchers ()
{
  if (Array.isArray(watchers))
  {
    for (const watcher of watchers)
    {
      watcher.close();  
    }
  }

  watchers = [];
}

function initEntries ()
{
  entries = config.build.entries;
  entryReverses = {};
  entryOuts = Object.keys(entries).map(eName => path.join(config.build.directory, eName + '.css'));

  for (const entryName in entries)
  {
    const entryPaths = entries[entryName];
    
    for (const entryPath of entryPaths)
    {
      entryReverses[entryPath] = entryName;  
    }
  }
}

function build ()
{
  buildModules();
  buildEntries();
}

// function w ()
// {
//   const entryPaths = Object.keys(entryReverses);
//   const watcher = chokidar.watch(entryPaths);

//   watcher.on('change', (entryPath) =>
//   {

//   });

//   watcher.on('unlink', (entryPath) =>
//   {

//   });

//   watchers.push(watcher);
// }

// function watchFiles ()
// {
//   fileWatchings = {};
//   fileWatcher = chokidar.watch(Object.keys(fileWatchings));

//   fileWatcher.on('change', (filePath) =>
//   {
//     // else if (isScript(filePath))
//     // {
//     //   onCreateOrUpdateFile(filePath, true);
//     // }
//   });

//   fileWatcher.on('unlink', (filePath) =>
//   {
//     // else if (isScript(filePath))
//     // {
//     //   onDeleteFile(filePath);
//     // }
//   });

// }

// function watchModules ()
// {
//   for (const pattern of config.module.patterns)
//   {
//     const watcher = chokidar.watch(pattern);

//     watcher.on('add', (filePath) =>
//     {
//       // if (isSource(filePath))
//       // {
//       //   onCreateOrUpdateStyleFile(filePath, true);
//       // }
//     });

//     watcher.on('change', (filePath) =>
//     {
//       // if (isSource(filePath))
//       // {
//       //   onCreateOrUpdateStyleFile(filePath, true);
//       // }
//     });

//     watcher.on('unlink', (filePath) =>
//     {
//       // if (isSource(filePath))
//       // {
//       //   onDeleteStyleFile(filePath, true);
//       // }
//     });

//     watchers.push(watcher);  
//   }
// }

function collectEntriesDependencies ()
{
  for (const entryName in entries)
  {
    for (const entryPath of entries[entryName])
    {
      collectEntryDependencies(entryPath);
    }
  }
}

function collectEntryDependencies (entryPath: string)
{
  const dependencyPaths = evaluator.getBundles(entryPath, packages);

  for (const dependencyPath of dependencyPaths)
  {
    if (!dependencyReverses[dependencyPath])
    {
      dependencyReverses[dependencyPath] = [];
    }

    dependencyReverses[dependencyPath].push(entryPath);
  }

  dependencies[entryPath] = dependencyPaths.filter(e => e !== entryPath);
}

function releaseEntryDependencies (entryPath: string)
{
  const dependencyPaths = dependencies[entryPath];

  if (Array.isArray(dependencyPaths))
  {
    delete dependencies[entryPath];
    delete dependencyReverses[entryPath];

    for (const dependencyPath of dependencyPaths)
    {
      const ePaths = dependencyReverses[dependencyPath];
      
      if (Array.isArray(ePaths))
      {
        dependencyReverses[dependencyPath] = ePaths.filter(e => e !== entryPath);
      }
    }
  }
}

// function collectFiles ()
// {
//   const entryPaths = Object.keys(entryReverses);

  
// }

function buildModules ()
{
  const modulePattern = path.join(config.source.directory, '/**/*' + config.module.input.extension);
  const modulePaths = glob.sync(modulePattern);

  for (const modulePath of modulePaths)
  {
    buildModule(modulePath);
  }
}

function buildModule (modulePath: string)
{
  interface Data {
    entry?: string;
    default: string;
  }

  function readFromScript (): Data
  {
    const entry = evaluator.getConst(modulePath, 'entry');
    const src = evaluator.getConst(modulePath, 'default');

    return {
      entry,
      default: src ?? '',
    };
  }

  function readFromFile (): Data
  {
    return readCSSFromFile(modulePath);
  }

  const data = isScript(modulePath) ? readFromScript() : readFromFile();


  
  const outPath = modulePath.replace(config.module.input.extension, config.module.output.extension);
  const outData = '';//`const names = ${JSON.stringify(mods, null, 2)};\n\nexport default names;`;

  if (!fs.existsSync(outPath))
  {
    console.log('[create]', outPath);
  }
  else
  {
    console.log('[update]', outPath);
  }

  fs.writeFileSync(outPath, outData);
}

function buildEntries ()
{
  const entryPaths = Object.keys(entryReverses);

  for (const entryPath of entryPaths)
  {
    buildEntry(entryPath);
  }
}

function buildEntry (entryPath: string)
{
  const entryName = entryReverses[entryPath];
  const dependencyPaths = dependencies[entryPath];

  for (const dependencyPath of dependencyPaths)
  {
    //
  }

  const outPath = path.join(config.build.directory, entryName + '.css');
  const outData = '';

  if (!fs.existsSync(outPath))
  {
    console.log('[create]', outPath);
  }
  else
  {
    const oldData = fs.readFileSync(outPath).toString('utf8');

    if (oldData === outData)
    {
      // console.log('[skip]', cOut);
      return;
    }

    console.log('[update]', outPath);
  }

  fs.writeFileSync(outPath, outData);
}

function isStylesheet (filePath: string)
{
  return filePath.endsWith('.css');
}

function isScript (filePath: string)
{
  return filePath.endsWith('.ts') || filePath.endsWith('.tsx') || filePath.endsWith('.js') || filePath.endsWith('.jsx');
}