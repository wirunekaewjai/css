import chokidar, { FSWatcher } from 'chokidar';
import glob from 'glob';
import path from 'path';
import fs from 'fs';

import { CSSConfig } from '../../../config/types';

import evaluator from '../evaluator';
import collector, { Collection } from './collector';

interface Generic<T> {
  [key: string]: T;
}

interface Collections {
  [path: string]: Collection;
}

interface Dependencies {
  [path: string]: string[];
}

let config: CSSConfig;

let entries: Generic<string>;
let entryReverses: Generic<string>;
let entryPaths: string[];

let screens: Generic<number>;
let screenIndices: string[];

let collections: Collections;

let dependencies: Dependencies;
let dependencyReverses: Dependencies;

let watchers: FSWatcher[];

function init ($config: CSSConfig, draft: boolean = false)
{
  if (Array.isArray(watchers))
  {
    for (const watcher of watchers)
    {
      watcher.close();  
    }
  }
  
  config = $config;

  entries = config.out.css.entries;
  entryReverses = {};
  entryPaths = Object.values(entries);

  for (const eName in entries)
  {
    entryReverses[entries[eName]] = eName;
  }

  screens = config.extends.screens;
  screenIndices = Object.keys(screens).sort((a, b) => screens[a] - screens[b]);

  collections = {};

  dependencies = {};
  dependencyReverses = {};

  watchers = [];
  collector.init(draft);

  createBase();

  collectEntriesDependencies(entryPaths);
  collectStyles();
}

function build ()
{
  for (const ePath of entryPaths)
  {
    createCSSFile(ePath);
  }
}

function watch ()
{
  const pattern = path.join(config.source.dir, '/**');
  const watcher = chokidar.watch(pattern);

  watcher.on('add', (filePath) =>
  {
    if (filePath.endsWith(config.source.ext))
    {
      onCreateOrUpdateStyleFile(filePath);
    }
    else if (filePath.endsWith('.ts') || filePath.endsWith('.tsx') || filePath.endsWith('.js') || filePath.endsWith('.jsx'))
    {
      onCreateOrUpdateFile(filePath);
    }
  });

  watcher.on('change', (filePath) =>
  {
    if (filePath.endsWith(config.source.ext))
    {
      onCreateOrUpdateStyleFile(filePath);
    }
    else if (filePath.endsWith('.ts') || filePath.endsWith('.tsx') || filePath.endsWith('.js') || filePath.endsWith('.jsx'))
    {
      onCreateOrUpdateFile(filePath);
    }
  });

  watcher.on('unlink', (filePath) =>
  {
    if (filePath.endsWith(config.source.ext))
    {
      onDeleteStyleFile(filePath);
    }
    else if (filePath.endsWith('.ts') || filePath.endsWith('.tsx') || filePath.endsWith('.js') || filePath.endsWith('.jsx'))
    {
      onDeleteFile(filePath);
    }
  });

  watchers.push(watcher);
}

function createBase ()
{
  const preflight = require('./preflight');
  const preflightCSS = preflight.default as string;

  const vars: string[] = [];

  for (const screen of screenIndices)
  {
    const width = screens[screen];
    
    if (width > 0)
    {
      vars.push(`--screen-size-${screen}: ${width}px`);
    }
  }

  for (const [type, family] of Object.entries(config.extends.font.family))
  {
    vars.push(`--font-${type}: ${family}`);
  }
  
  const basePath = path.join(config.out.css.dir, config.out.css.base + '.css');
  const baseCSS = `:root { ${vars.join('; ')} }\n\n` + preflightCSS;

  fs.writeFileSync(basePath, baseCSS);
  console.log('[update]', basePath);
}

function collectEntriesDependencies (ePaths: string[])
{
  for (const ePath of ePaths)
  {
    collectEntryDependencies(ePath);  
  }
}

function collectEntryDependencies (ePath: string)
{
  const dPaths = evaluator.getBundles(ePath, config.externals);

  for (const dPath of dPaths)
  {
    if (!dependencyReverses[dPath])
    {
      dependencyReverses[dPath] = [];
    }

    dependencyReverses[dPath].push(ePath);
  }

  dependencies[ePath] = dPaths.filter(e => e !== ePath);
}

function releaseEntryDependencies (ePath: string)
{
  const dPaths = dependencies[ePath];

  if (Array.isArray(dPaths))
  {
    delete dependencies[ePath];
    delete dependencyReverses[ePath];

    for (const dPath of dPaths)
    {
      const ePaths = dependencyReverses[dPath];
      
      if (Array.isArray(ePaths))
      {
        dependencyReverses[dPath] = ePaths.filter(e => e !== ePath);
      }
    }
  }
}

function collectStyles ()
{
  const sPattern = path.join(config.source.dir, '/**', '/*' + config.source.ext);
  const sPaths = glob.sync(sPattern);

  for (const sPath of sPaths)
  {
    onCreateOrUpdateStyleFile(sPath);
  }
}

function onCreateOrUpdateStyleFile (sPath: string)
{
  const collection = collector.collect(sPath);

  const cPath = sPath.replace(config.source.ext, config.out.classes.ext);
  const cCode = `const names = ${JSON.stringify(collection.names, null, 2)};\n\nexport default names;`;

  if (!fs.existsSync(cPath))
  {
    console.log('[create]', cPath);
  }
  else
  {
    console.log('[update]', cPath);
  }

  fs.writeFileSync(cPath, cCode);

  collections[cPath] = collection;
}

function onDeleteStyleFile (sPath: string)
{
  const cPath = sPath.replace(config.source.ext, config.out.classes.ext);
  
  if (fs.existsSync(cPath))
  {
    fs.unlinkSync(cPath);
    console.log('[delete]', cPath);
  }

  delete collections[cPath];
}

function onCreateOrUpdateFile (fPath: string)
{
  if (entryPaths.includes(fPath))
  {
    releaseEntryDependencies(fPath);
    collectEntryDependencies(fPath);
  }

  createCSSFiles(fPath);
}

function onDeleteFile (fPath: string)
{
  if (entryPaths.includes(fPath))
  {
    releaseEntryDependencies(fPath);
  }

  createCSSFiles(fPath);
}

function createCSSFiles (dPath: string)
{
  const entryPaths = dependencyReverses[dPath];

  if (Array.isArray(entryPaths) && entryPaths.length > 0)
  {
    for (const ePath of entryPaths)
    {
      createCSSFile(ePath);
    }
  }
}

function createCSSFile (ePath: string)
{
  const eName = entryReverses[ePath];
  const dPaths = dependencies[ePath];

  const css: { [key: string]: string[] } = {};

  for (const dPath of dPaths)
  {
    if (collections[dPath])
    {
      const stylesheet = collections[dPath];

      for (const screen in stylesheet.values)
      {
        const classMaps = stylesheet.values[screen];
        
        for (const classValue in classMaps)
        {
          const classKeys = classMaps[classValue];
          const classSelector = Array.from(new Set(classKeys)).join(', ');

          if (!css[screen])
          {
            css[screen] = [];
          }

          css[screen].push(`${classSelector} { ${classValue} }`);
        }
      }
    }
  }

  const cOut = path.join(config.out.css.dir, eName + '.css');
  const cCss: string[] = [];

  for (const screen of screenIndices)
  {
    if (Array.isArray(css[screen]) && css[screen].length > 0)
    {
      const cssText = Array.from(new Set(css[screen])).join('\n');
      const minWidth = screens[screen];

      if (minWidth > 0)
      {
        cCss.push(`@media (min-width: ${minWidth}px) {\n${cssText}\n}`);
      }
      else
      {
        cCss.push(cssText);
      }
    }
  }

  if (!fs.existsSync(cOut))
  {
    console.log('[create]', cOut);
  }
  else
  {
    console.log('[update]', cOut);
  }

  fs.writeFileSync(cOut, cCss.join('\n\n'));
}

export default {
  init,
  build,
  watch,
}