import chokidar, { FSWatcher } from 'chokidar';
import glob from 'glob';
import path from 'path';
import fs from 'fs';
import fsx from 'fs-extra';

import evaluator from '../utils/evaluator';
import Hashes from '../utils/hashes';

import styleParser from './style-parser';

import { Stylesheet } from '../../utils/css/parse/types';
import { Config } from '../../config/types';
import { Args, Generic, Styles } from './types';

let config: Config;
let packages: string[];
let watchers: FSWatcher[];

let hashes: Hashes;

let entries: Generic<string[]>;
let entryReverses: Generic<string>;

let entryDependencies: Generic<string[]>;

let globalStyles: Generic<Generic<Styles>>;
let globalStylePaths: Generic<string>;

let localStyles: Generic<Styles>;

export default function run (args: Args)
{
  const pkgPath = 'package.json';

  function initPackages ()
  {
    packages = [];

    if (!fs.existsSync(pkgPath))
    {
      return;
    }

    const includePackages = config.packages;

    const file = fs.readFileSync(pkgPath)?.toString('utf8');
    const json = JSON.parse(file);

    if (json.dependencies && typeof json.dependencies === 'object')
    {
      for (const pck of Object.keys(json.dependencies))
      {
        if (!includePackages.includes(pck))
        {
          packages.push(pck);
        }
      }
    }

    if (json.devDependencies && typeof json.devDependencies === 'object')
    {
      for (const pck of Object.keys(json.devDependencies))
      {
        if (!includePackages.includes(pck))
        {
          packages.push(pck);
        }
      }
    }
  }

  const configPath = args.config ?? 'wkcss.config.ts';

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

  if (args.watch)
  {
    function watchPackages ()
    {
      const watcher = chokidar.watch(pkgPath);

      watcher.on('change', () => 
      {
        initPackages();
      });
    }

    function watchConfig ()
    {
      const watcher = chokidar.watch(configPath);

      watcher.on('add', () => 
      {
        config = evaluator.getConst(configPath, 'default');

        if (!config)
        {
          console.error('invalid config');
          process.exit(1);
        }

        init();
        build();
        watch();
      });

      watcher.on('change', () => 
      {
        config = evaluator.getConst(configPath, 'default');

        if (!config)
        {
          console.error('invalid config');
          process.exit(1);
        }

        init();
        watch();
      });

      watcher.on('unlink', () => 
      {
        process.exit(1);
      });
    }

    watchPackages();
    watchConfig();
  }
  else
  {
    init();
    build();
  }
}

function init ()
{
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
    entryDependencies = {};

    for (const entryName in entries)
    {
      const entryPaths = entries[entryName];

      for (const entryPath of entryPaths)
      {
        entryReverses[entryPath] = entryName;
        entryDependencies[entryPath] = [entryName];
      }
    }
  }

  initWatchers();
  initEntries();

  hashes = new Hashes();

  globalStyles = {};
  globalStylePaths = {};

  localStyles = {};

  styleParser.local.init();
  
  collectEntriesDependencies();
  collectFiles();
}

function build ()
{
  buildModules();
  buildEntries();
}

function watch ()
{
  const patterns = config.sources.map(source => path.join(source.directory, '/**/*'));
  const watcher = chokidar.watch(patterns);

  watcher.on('add', (filePath) =>
  {
    if (isModulePath(filePath))
    {
      updateModuleFile(filePath);
    }
    else if (isEntryPath(filePath))
    {
      updateEntryFile(filePath);
    }
    else if (isCodePath(filePath))
    {
      updateCodeFile(filePath);
    }
  });

  watcher.on('change', (filePath) =>
  {
    if (isModulePath(filePath))
    {
      updateModuleFile(filePath);
    }
    else if (isEntryPath(filePath))
    {
      updateEntryFile(filePath);
    }
    else if (isCodePath(filePath))
    {
      updateCodeFile(filePath);
    }
  });

  watcher.on('unlink', (filePath) =>
  {
    if (isModulePath(filePath))
    {
      deleteModuleFile(filePath);
    }
    else if (isEntryPath(filePath))
    {
      deleteEntryFile(filePath);
    }
    else if (isCodePath(filePath))
    {
      deleteCodeFile(filePath);
    }
  });

  watchers.push(watcher);
}

function replaceModuleExtension (filePath: string)
{
  for (const extension of config.module.inputs)
  {
    if (filePath.endsWith(extension))
    {
      return filePath.replace(extension, config.module.output);
    }
  }

  return filePath;
}

function isFile (filePath: string)
{
  return fs.lstatSync(filePath);
}

function isModulePath (filePath: string)
{
  for (const extension of config.module.inputs)
  {
    return filePath.endsWith(extension);
  }

  return false;
}

function isEntryPath (filePath: string)
{
  return entryReverses[filePath];
}

function isCodePath (filePath: string)
{
  const exts = ['.ts', '.tsx', '.js', '.jsx'];

  for (const ext of exts)
  {
    if (filePath.endsWith(ext))
    {
      const tempExt = '.wktmp' + ext;

      if (!filePath.endsWith(tempExt))
      {
        return true;
      }
    }
  }

  return false;
}

function isTempPath (filePath: string)
{
  const exts = ['.ts', '.tsx', '.js', '.jsx'];

  for (const ext of exts)
  {
    if (filePath.endsWith(ext))
    {
      const tempExt = '.wktmp' + ext;

      if (filePath.endsWith(tempExt))
      {
        return true;
      }
    }
  }

  return false;
}

function collectFiles ()
{
  for (const source of config.sources)
  {
    const pattern = path.join(source.directory, '/**/*');
    const paths = glob.sync(pattern);

    for (const filePath of paths)
    {
      if (isFile(filePath))
      {
        if (isTempPath(filePath))
        {
          fs.unlinkSync(filePath);
        }
        else if (isModulePath(filePath) || isEntryPath(filePath) || isCodePath(filePath))
        {
          hashes.setChanged(filePath);
        }
      }
    }
  }
}

function collectEntriesDependencies ()
{
  for (const entryName in entries)
  {
    collectEntryDependencies(entryName);
  }
}

function collectEntryDependencies (entryName: string)
{
  function getBundles (filePath: string)
  {
    return evaluator.getBundles(filePath, packages);
  }

  const entryPaths = entries[entryName];
  
  for (const entryPath of entryPaths)
  {
    const dependencyPaths = getBundles(entryPath);

    for (const dependencyPath of dependencyPaths)
    {
      if (!isCodePath(dependencyPath))
      {
        continue;
      }

      if (!entryDependencies[dependencyPath])
      {
        entryDependencies[dependencyPath] = [];
      }

      if (!entryDependencies[dependencyPath].includes(entryName))
      {
        entryDependencies[dependencyPath].push(entryName);
      }
    }
  }
}

function releaseEntryDependencies (entryName: string)
{
  for (const filePath in entryDependencies)
  {
    entryDependencies[filePath] = entryDependencies[filePath].filter(e => e !== entryName);

    if (entryDependencies[filePath].length === 0)
    {
      delete entryDependencies[filePath];
    }
  }
}

function updateEntryFile (filePath: string)
{
  if (!hashes.hasChanged(filePath))
  {
    return;
  }

  hashes.setChanged(filePath);

  const entryName = entryReverses[filePath];

  releaseEntryDependencies(entryName);
  collectEntryDependencies(entryName);

  buildEntry(entryName);
}

function deleteEntryFile (filePath: string)
{
  hashes.setChanged(filePath);

  const entryName = entryReverses[filePath];

  releaseEntryDependencies(entryName);
  
  buildEntry(entryName);
}

function updateCodeFile (filePath: string)
{
  if (!hashes.hasChanged(filePath))
  {
    return;
  }
  
  hashes.setChanged(filePath);

  if (entryDependencies[filePath])
  {
    const entryNames = entryDependencies[filePath];

    for (const entryName of entryNames)
    {
      releaseEntryDependencies(entryName);
      collectEntryDependencies(entryName);

      buildEntry(entryName);  
    }
  }
}

function deleteCodeFile (filePath: string)
{
  hashes.setChanged(filePath);

  if (entryDependencies[filePath])
  {
    const entryNames = entryDependencies[filePath];

    delete entryDependencies[filePath];

    for (const entryName of entryNames)
    {
      releaseEntryDependencies(entryName);
      collectEntryDependencies(entryName);

      buildEntry(entryName);  
    }
  }
}

function updateModuleFile (filePath: string)
{
  if (!hashes.hasChanged(filePath))
  {
    // console.log('[skip]', filePath);
    return;
  }

  hashes.setChanged(filePath);

  buildModule(filePath, true);
}

function deleteModuleFile (filePath: string)
{
  hashes.setChanged(filePath);

  if (globalStylePaths[filePath])
  {
    const entryName = globalStylePaths[filePath];

    delete globalStylePaths[filePath];

    console.log('[release]', filePath);

    if (globalStyles[entryName])
    {
      delete globalStyles[entryName][filePath];

      if (entries[entryName])
      {
        buildEntry(entryName);
      }
    }
  }
  else
  {
    const outPath = replaceModuleExtension(filePath);

    if (fs.existsSync(outPath))
    {
      fs.unlinkSync(outPath);
      console.log('[delete]', outPath);
    }

    delete localStyles[outPath];
  }
}

function buildModules ()
{
  for (const source of config.sources)
  {
    for (const moduleExtension of config.module.inputs)
    {
      const modulePattern = path.join(source.directory, '/**/*' + moduleExtension);
      const modulePaths = glob.sync(modulePattern);

      for (const modulePath of modulePaths)
      {
        if (isFile(modulePath))
        {
          buildModule(modulePath, false);
        }
      }
    }
  }
}

function buildModule (filePath: string, shouldRebuildEntry: boolean)
{
  interface Data
  {
    entry?: string;
    default: Stylesheet;
  }

  const data = evaluator.getConsts<Data>(filePath, ['entry', 'default']);
  
  if (!data)
  {
    return;
  }

  if (typeof data.entry === 'string' && data.entry?.length > 0)
  {
    const outPath = replaceModuleExtension(filePath);

    if (fs.existsSync(outPath))
    {
      fs.unlinkSync(outPath);
      console.log('[delete]', outPath);
    }

    if (localStyles[outPath])
    {
      delete localStyles[outPath];
    }

    const { styles } = styleParser.global(data.default);
    const entryName = data.entry;;

    if (!globalStyles[entryName])
    {
      globalStyles[entryName] = {};
    }

    globalStyles[entryName][filePath] = styles;
    globalStylePaths[filePath] = entryName;

    console.log('[collect]', filePath);

    if (entries[entryName] && shouldRebuildEntry)
    {
      buildEntry(entryName);
    }
  }
  else
  {
    const { modules, styles } = styleParser.local.parse(data.default);
    const outPath = replaceModuleExtension(filePath);
    
    if (Object.keys(modules).length === 0)
    {
      if (fs.existsSync(outPath))
      {
        fs.unlinkSync(outPath);
        console.log('[delete]', outPath);
      }

      if (localStyles[outPath])
      {
        delete localStyles[outPath];
      }
    }
    else
    {
      const outData = `const names = ${JSON.stringify(modules, null, 2)};\n\nexport default names;`;

      fs.writeFileSync(outPath, outData);
      localStyles[outPath] = styles;

      console.log('[collect]', filePath);
    }
  }
}

function buildEntries ()
{
  for (const entryName in entries)
  {
    buildEntry(entryName);
  }
}

function buildEntry (entryName: string)
{
  const entryStyles: Array<Styles> = [];

  if (globalStyles[entryName])
  {
    for (const filePath in globalStyles[entryName])
    {
      entryStyles.push(globalStyles[entryName][filePath]);
    }
  }

  for (const filePath in entryDependencies)
  {
    if (entryDependencies[filePath].includes(entryName))
    {
      if (localStyles[filePath])
      {
        entryStyles.push(localStyles[filePath]);
      }
    }
  }

  const entryStyle = styleParser.merge(entryStyles);
  const entryCSS = styleParser.build(entryStyle);

  fsx.mkdirpSync(config.build.directory);

  const outPath = path.join(config.build.directory, entryName + '.css');
  const outData = entryCSS;

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