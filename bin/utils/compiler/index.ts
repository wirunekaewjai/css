import chokidar, { FSWatcher } from 'chokidar';
import glob from 'glob';
import path from 'path';
import fs from 'fs';

import * as hasha from 'hasha';

import { CSSCollection, CSSValues, CSSValue, Generic } from '../../../css/types';
import { CSSConfig } from '../../../config/types';

import { cssFromString } from '../../../css';
import { join, distinct } from '../../../css/array';

import mergeTags from '../../../css/merge-tags';
import mergeValues from '../../../css/merge-values';
import purgeVars from '../../../css/purge-vars';

import sortSelectors from '../../../css/sort-selectors';

import evaluator from '../evaluator';
import incremental from '../incremental';

interface Dependencies {
  [path: string]: string[];
}

let config: CSSConfig;

let hashes: Generic<string>;

let entries: Generic<string[]>;
let entryReverses: Generic<string>;
let entryOuts: string[];

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
  entryOuts = Object.keys(entries).map(eName => path.join(config.out.css.dir, eName + '.css'));

  for (const eName in entries)
  {
    const ePaths = entries[eName];
    
    for (const ePath of ePaths)
    {
      entryReverses[ePath] = eName;  
    }
  }

  modules = {};

  globals = {};
  globalPaths = {};

  dependencies = {};
  dependencyReverses = {};

  watchers = [];

  incremental.reset();

  collectEntriesDependencies();
  collectFiles();
}

function build ()
{
  for (const eName in entries)
  {
    createCSSFile(eName);
  }
}

function watch ()
{
  build();

  const pattern = path.join(config.source.dir, '/**');
  const watcher = chokidar.watch(pattern);

  watcher.on('add', (filePath) =>
  {
    if (isSource(filePath))
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
    if (isSource(filePath))
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
    if (isSource(filePath))
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

function isSource (filePath: string)
{
  return filePath.endsWith(config.source.ext) && !entryOuts.includes(filePath); 
}

function isScript (filePath: string)
{
  return filePath.endsWith('.ts') || filePath.endsWith('.tsx') || filePath.endsWith('.js') || filePath.endsWith('.jsx');
}

function collectEntriesDependencies ()
{
  for (const eName in entries)
  {
    for (const ePath of entries[eName])
    {
      collectEntryDependencies(ePath);
    }
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
    if (isSource(filePath))
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

  if (sPath.endsWith('.css'))
  {
    onCreateOrUpdateStyleFileFromCSS(sPath, buildable);
  }
  else
  {
    onCreateOrUpdateStyleFileFromScript(sPath, buildable);
  }
}

function onCreateOrUpdateStyleFileFromCSS (sPath: string, buildable: boolean = false)
{
  function getEntryName (text: string)
  {
    const names: string[] = [];

    text.replace(/^\s*\/\*\s*[A-Za-z0-9-_]+\s*\*\//, (c, i) =>
    {
      names.push(c.trim().slice(2, -2).trim());
      return c;
    });

    if (names.length > 0)
    {
      return names[0];
    }

    return undefined;
  }

  const cssCode = fs.readFileSync(sPath).toString('utf8');

  if (!cssCode || cssCode?.trim()?.length === 0)
  {
    return;
  }

  const eName = getEntryName(cssCode);
  const css = cssFromString(cssCode);

  if (typeof eName === 'string' && eName.length > 0)
  {
    if (!globals[eName])
    {
      globals[eName] = {};
    }

    globals[eName][sPath] = css.values;
    globalPaths[sPath] = eName;

    console.log('[collect]', sPath);

    if (buildable && entries[eName])
    {
      createCSSFile(eName);
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

function onCreateOrUpdateStyleFileFromScript (sPath: string, buildable: boolean = false)
{
  const eName = evaluator.getConst(sPath, 'entry');
  const eCSS = evaluator.getConst(sPath, 'default');
  
  if (!eCSS || typeof eCSS !== 'object' || Object.keys(eCSS).length === 0)
  {
    return;
  }

  const css = eCSS as CSSCollection;

  if (typeof eName === 'string' && eName?.length > 0)
  {
    if (!globals[eName])
    {
      globals[eName] = {};
    }

    globals[eName][sPath] = css.values;
    globalPaths[sPath] = eName;

    console.log('[collect]', sPath);

    if (buildable && entries[eName])
    {
      createCSSFile(eName);
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
    const eName = globalPaths[sPath];

    delete globalPaths[sPath];

    console.log('[release]', sPath);

    if (globals[eName])
    {
      delete globals[eName][sPath];

      if (buildable && entries[eName])
      {
        createCSSFile(eName);
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

  for (const eName in entries)
  {
    if (entries[eName].includes(fPath))
    {
      releaseEntryDependencies(fPath);
      collectEntryDependencies(fPath);
    }
  }

  if (buildable)
  {
    createCSSFileFromDependency(fPath);
  }
}

function onDeleteFile (fPath: string)
{
  setChanged(fPath);

  for (const eName in entries)
  {
    if (entries[eName].includes(fPath))
    {
      releaseEntryDependencies(fPath);
    }
  }

  createCSSFileFromDependency(fPath);
}

function createCSSFileFromDependency (dPath: string)
{
  const entryPaths = dependencyReverses[dPath];

  if (Array.isArray(entryPaths) && entryPaths.length > 0)
  {
    const eNames: string[] = [];

    for (const eName in entries)
    {
      const ePaths = entries[eName];

      for (const ePath of entryPaths)
      {
        if (ePaths.includes(ePath))
        {
          eNames.push(eName);
          break;
        }
      }
    }

    for (const eName of eNames)
    {
      createCSSFile(eName);  
    }
  }
}

function createCSSFile (eName: string)
{
  const ePaths = entries[eName];

  const merges: CSSValues[] = [];

  if (globals[eName])
  {
    for (const sPath in globals[eName])
    {
      merges.push(globals[eName][sPath]);
    }
  }

  for (const ePath of ePaths)
  {
    for (const dPath of dependencies[ePath])
    {
      if (modules[dPath])
      {
        merges.push(modules[dPath]);
      }
    }
  }

  const cOut = path.join(config.out.css.dir, eName + '.css');
  const cCode = createCSSSourceCode(
    mergeTags(
      purgeVars(
        mergeValues(merges)
      )
    )
  );

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

      const selector = join(distinct(sortSelectors(selectors)), `, `);
      const element = `${selector} { ${key} }`;

      dst.push(element);
    }
  }

  return join(sortSelectors(dst), ' ');
}

export default {
  init,
  build,
  watch,
}