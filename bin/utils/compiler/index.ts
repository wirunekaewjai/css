import chokidar, { FSWatcher } from 'chokidar';
import glob from 'glob';
import path from 'path';
import fs from 'fs';

import { CSSCollection, CSSValues, CSSValue, Generic } from '../../../css/types';
import { CSSConfig } from '../../../config/types';

import { join } from '../../../css/array';
import mergeValues from '../../../css/merge-values';

import evaluator from '../evaluator';
import incremental from '../incremental';

interface Dependencies {
  [path: string]: string[];
}

let config: CSSConfig;

let entries: Generic<string>;
let entryReverses: Generic<string>;
let entryPaths: string[];

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

  entries = config.out.css.entries;
  entryReverses = {};
  entryPaths = Object.values(entries);

  for (const eName in entries)
  {
    entryReverses[entries[eName]] = eName;
  }

  modules = {};

  dependencies = {};
  dependencyReverses = {};

  watchers = [];

  incremental.reset();

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
  const css = (evaluator.getConst(sPath, 'default') ?? {}) as CSSCollection;
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

function onDeleteStyleFile (sPath: string)
{
  const cPath = sPath.replace(config.source.ext, config.out.classes.ext);
  
  if (fs.existsSync(cPath))
  {
    fs.unlinkSync(cPath);
    console.log('[delete]', cPath);
  }

  delete modules[cPath];
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

  const merges: CSSValues[] = [];

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
    console.log('[update]', cOut);
  }

  fs.writeFileSync(cOut, cCode);

  // const cOut = path.join(config.out.css.dir, eName + '.css');
  // const cCss: string[] = [];

  // for (const screen of screenIndices)
  // {
  //   if (Array.isArray(css[screen]) && css[screen].length > 0)
  //   {
  //     const cssText = Array.from(new Set(css[screen])).join('\n');
  //     const minWidth = screens[screen];

  //     if (minWidth > 0)
  //     {
  //       cCss.push(`@media (min-width: ${minWidth}px) {\n${cssText}\n}`);
  //     }
  //     else
  //     {
  //       cCss.push(cssText);
  //     }
  //   }
  // }

  // if (!fs.existsSync(cOut))
  // {
  //   console.log('[create]', cOut);
  // }
  // else
  // {
  //   console.log('[update]', cOut);
  // }

  // fs.writeFileSync(cOut, cCss.join('\n\n'));
}

function sortCSSSelectors (selectors: string[])
{
  return selectors.sort((a, b) =>
  {
    if (a[0] === b[0])
    {
      return a.localeCompare(b);
    }

    const ai = a[0] === '.' ? 0 : 1;
    const bi = b[0] === '.' ? 0 : 1;

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

      const selector = join(sortCSSSelectors(selectors), `, `);
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