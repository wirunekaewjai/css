import chokidar, { FSWatcher } from 'chokidar';
import glob from 'glob';
import path from 'path';
import fs from 'fs';

import * as hasha from 'hasha';

import { CSSCollection, CSSValues, CSSValue, Generic } from '../../../css/types';
import { CSSConfig } from '../../../config/types';

import { join, distinct } from '../../../css/array';
import mergeValues from '../../../css/merge-values';

import evaluator from '../evaluator';
import incremental from '../incremental';

interface Dependencies {
  [path: string]: string[];
}

let config: CSSConfig;

let hashes: Generic<string>;

let entries: Generic<string>;
let entryReverses: Generic<string>;
let entryPaths: string[];

let globals: Generic<Generic<CSSValues>>;
let globalPaths: Generic<string>;

let modules: Generic<CSSValues>;

let dependencies: Dependencies;
let dependencyReverses: Dependencies;

let watchers: FSWatcher[];

function init ($config: CSSConfig)
{
  if (Array.isArray(watchers))
  {
    for (const watcher of watchers)
    {
      watcher.close();  
    }
  }
  
  config = $config;

  hashes = {};

  entries = config.out.css.entries;
  entryReverses = {};
  entryPaths = Object.values(entries);

  for (const eName in entries)
  {
    entryReverses[entries[eName]] = eName;
  }

  modules = {};

  globals = {};
  globalPaths = {};

  dependencies = {};
  dependencyReverses = {};

  watchers = [];

  incremental.reset();

  collectEntriesDependencies(entryPaths);
  // collectStyles();
  collectFiles();
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
  build();

  const pattern = path.join(config.source.dir, '/**');
  const watcher = chokidar.watch(pattern);

  watcher.on('add', (filePath) =>
  {
    if (filePath.endsWith(config.source.ext))
    {
      onCreateOrUpdateStyleFile(filePath, true);
    }
    else if (isScript(filePath))
    {
      onCreateOrUpdateFile(filePath, true);
    }
  });

  watcher.on('change', (filePath) =>
  {
    if (filePath.endsWith(config.source.ext))
    {
      onCreateOrUpdateStyleFile(filePath, true);
    }
    else if (isScript(filePath))
    {
      onCreateOrUpdateFile(filePath, true);
    }
  });

  watcher.on('unlink', (filePath) =>
  {
    if (filePath.endsWith(config.source.ext))
    {
      onDeleteStyleFile(filePath, true);
    }
    else if (isScript(filePath))
    {
      onDeleteFile(filePath);
    }
  });

  watchers.push(watcher);
}

function isScript (filePath: string)
{
  return filePath.endsWith('.ts') || filePath.endsWith('.tsx') || filePath.endsWith('.js') || filePath.endsWith('.jsx');
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

function collectFiles ()
{
  const fPattern = path.join(config.source.dir, '/**');
  const fPaths = glob.sync(fPattern);

  for (const filePath of fPaths)
  {
    if (filePath.endsWith(config.source.ext))
    {
      onCreateOrUpdateStyleFile(filePath, false);
    }
    else if (isScript(filePath))
    {
      onCreateOrUpdateFile(filePath, false);
    }
  }
}

function hasChanged (fPath: string)
{
  if (!fs.existsSync(fPath))
  {
    return false;
  }

  if (!hashes[fPath])
  {
    return true;
  }

  const hash = hasha.fromFileSync(fPath, { algorithm: 'sha1' }) ?? '';
  return hashes[fPath] !== hash;
}

function setChanged (fPath: string)
{
  if (!fs.existsSync(fPath) && hashes[fPath])
  {
    delete hashes[fPath];
  }

  if (fs.existsSync(fPath))
  {
    const hash = hasha.fromFileSync(fPath, { algorithm: 'sha1' });

    if (hash)
    {
      hashes[fPath] = hash;
    }
  }
}

function onCreateOrUpdateStyleFile (sPath: string, buildable: boolean = false)
{
  if (!hasChanged(sPath))
  {
    // console.log('[skip]', sPath);
    return;
  }

  setChanged(sPath);

  const entry = evaluator.getConst(sPath, 'entry');
  const css = (evaluator.getConst(sPath, 'default') ?? {}) as CSSCollection;

  if (!css || Object.keys(css).length === 0)
  {
    return;
  }

  if (typeof entry === 'string' && entry?.length > 0)
  {
    if (!globals[entry])
    {
      globals[entry] = {};
    }

    globals[entry][sPath] = css.values;
    globalPaths[sPath] = entry;

    console.log('[collect]', sPath);

    if (buildable && entries[entry])
    {
      createCSSFile(entries[entry]);
    }
  }
  else
  {
    const mods = createCSSModule(css.slugs);

    const cPath = sPath.replace(config.source.ext, config.out.classes.ext);
    const cCode = `const names = ${JSON.stringify(mods, null, 2)};\n\nexport default names;`;

    if (!fs.existsSync(cPath))
    {
      console.log('[create]', cPath);
    }
    else
    {
      console.log('[update]', cPath);
    }

    fs.writeFileSync(cPath, cCode);

    modules[cPath] = css.values;
  }
}

function onDeleteStyleFile (sPath: string, buildable: boolean = false)
{
  setChanged(sPath);

  if (globalPaths[sPath])
  {
    const entry = globalPaths[sPath];

    delete globalPaths[sPath];

    console.log('[release]', sPath);

    if (globals[entry])
    {
      delete globals[entry][sPath];

      if (buildable && entries[entry])
      {
        createCSSFile(entries[entry]);
      }
    }
  }
  else
  {
    const cPath = sPath.replace(config.source.ext, config.out.classes.ext);
  
    if (fs.existsSync(cPath))
    {
      fs.unlinkSync(cPath);
      console.log('[delete]', cPath);
    }

    delete modules[cPath];
  }
}

function onCreateOrUpdateFile (fPath: string, buildable: boolean = false)
{
  if (!hasChanged(fPath))
  {
    // console.log('[skip]', fPath);
    return;
  }

  setChanged(fPath);

  if (entryPaths.includes(fPath))
  {
    releaseEntryDependencies(fPath);
    collectEntryDependencies(fPath);
  }

  if (buildable)
  {
    createCSSFiles(fPath);
  }
}

function onDeleteFile (fPath: string)
{
  setChanged(fPath);

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

  const merges: CSSValues[] = [];

  if (globals[eName])
  {
    for (const sPath in globals[eName])
    {
      merges.push(globals[eName][sPath]);
    }
  }

  for (const dPath of dPaths)
  {
    if (modules[dPath])
    {
      merges.push(modules[dPath]);
    }
  }

  const cOut = path.join(config.out.css.dir, eName + '.css');
  const cCode = createCSSSourceCode(mergeValues(merges));

  if (!fs.existsSync(cOut))
  {
    console.log('[create]', cOut);
  }
  else
  {
    const cCodeOld = fs.readFileSync(cOut).toString('utf8');

    if (cCodeOld === cCode)
    {
      // console.log('[skip]', cOut);
      return;
    }

    console.log('[update]', cOut);
  }

  fs.writeFileSync(cOut, cCode);
}

const selectorIndices: Generic<number> = {
  ':': 0,
  '.': 2,
};

function sortCSSSelectors (selectors: string[])
{
  return selectors.sort((a, b) =>
  {
    if (a[0] === b[0])
    {
      return a.localeCompare(b);
    }

    const ai = selectorIndices[a[0]] ?? 1;
    const bi = selectorIndices[b[0]] ?? 1;

    return ai - bi;
  });
}

function createCSSModule (module: Generic<string[]>)
{
  const result: Generic<string> = {};

  for (const name in module)
  {
    result[name] = join(module[name].map(slug => incremental.get(slug)), ' ');
  }

  return result;
}

function createCSSSourceCode (values: CSSValues)
{
  const dst: string[] = [];

  for (const key in values)
  {
    if (key.startsWith('@page'))
    {
      const props = values[key] as string[];
      const value = join(props, '; ');

      const element = `${key} { ${value} }`;
      
      dst.push(element);
    }
    else if (key.startsWith('@'))
    {
      const children = createCSSSourceCode(values[key] as CSSValues);
      const element = `${key} { ${children} }`;

      dst.push(element);
    }
    else
    {
      const items = values[key] as CSSValue[];
      const selectors = items.map(e => {
        if (e.type === 'slug')
        {
          return join(['.' + incremental.get(e.name), e.selector], '');
        }

        return join([e.name, e.selector], '');
      });

      const selector = join(distinct(sortCSSSelectors(selectors)), `, `);
      const element = `${selector} { ${key} }`;

      dst.push(element);
    }
  }

  return join(dst, ' ');
}

export default {
  init,
  build,
  watch,
}