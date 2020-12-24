import chokidar, { FSWatcher } from 'chokidar';
import glob from 'glob';
import path from 'path';
import fs from 'fs';
import fsx from 'fs-extra';

import postCSS from 'postcss';

import evaluator from '../utils/evaluator';

import Hashes from '../utils/hashes';
import Incremental from '../utils/incremental';

import array from '../utils/array';

import { Stylesheet, Supports, Media, Keyframes, Rule, Comment } from '../../utils/css/parse/types';
import { Config } from '../../config/types';
import { Args, Generic, Styles } from './types';

let config: Config;
let packages: string[];
let watchers: FSWatcher[];

let incremental: Incremental;
let hashes: Hashes;

let entries: Generic<string[]>;
let entryReverses: Generic<string>;

let entryDependencies: Generic<string[]>;

let globalStyles: Generic<Generic<Styles>>;
let globalStylePaths: Generic<string>;

let localStyles: Generic<Styles>;

export default async function run (args: Args)
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

      watcher.on('add', async () => 
      {
        config = evaluator.getConst(configPath, 'default');

        if (!config)
        {
          console.error('invalid config');
          process.exit(1);
        }

        init();
        await build();
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
    await build();
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

  incremental = new Incremental();
  hashes = new Hashes();

  globalStyles = {};
  globalStylePaths = {};

  localStyles = {};

  collectEntriesDependencies();
  collectFiles();
}

async function build ()
{
  await buildModules();
  await buildEntries();
}

function watch ()
{
  const patterns = config.sources.map(source => path.join(source.directory, '/**/*'));
  const watcher = chokidar.watch(patterns);

  watcher.on('add', async (filePath) =>
  {
    if (isModulePath(filePath))
    {
      await updateModuleFile(filePath);
    }
    else if (isEntryPath(filePath))
    {
      await updateEntryFile(filePath);
    }
    else if (isCodePath(filePath))
    {
      await updateCodeFile(filePath);
    }
  });

  watcher.on('change', async (filePath) =>
  {
    if (isModulePath(filePath))
    {
      await updateModuleFile(filePath);
    }
    else if (isEntryPath(filePath))
    {
      await updateEntryFile(filePath);
    }
    else if (isCodePath(filePath))
    {
      await updateCodeFile(filePath);
    }
  });

  watcher.on('unlink', async (filePath) =>
  {
    if (isModulePath(filePath))
    {
      await deleteModuleFile(filePath);
    }
    else if (isEntryPath(filePath))
    {
      await deleteEntryFile(filePath);
    }
    else if (isCodePath(filePath))
    {
      await deleteCodeFile(filePath);
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
  return filePath.endsWith('.ts') || filePath.endsWith('.tsx') || filePath.endsWith('.js') || filePath.endsWith('.jsx');
}

function collectFiles ()
{
  for (const source of config.sources)
  {
    const pattern = path.join(source.directory, '/**/*');
    const paths = glob.sync(pattern);

    for (const filePath of paths)
    {
      if (isModulePath(filePath) || isEntryPath(filePath) || isCodePath(filePath))
      {
        hashes.setChanged(filePath);
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
  const entryPaths = entries[entryName];
  
  for (const entryPath of entryPaths)
  {
    const dependencyPaths = evaluator.getBundles(entryPath, packages);

    for (const dependencyPath of dependencyPaths)
    {
      if (!entryDependencies[dependencyPath])
      {
        entryDependencies[dependencyPath] = [];
      }

      entryDependencies[dependencyPath].push(entryName);
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

async function updateEntryFile (filePath: string)
{
  if (!hashes.hasChanged(filePath))
  {
    return;
  }

  hashes.setChanged(filePath);

  const entryName = entryReverses[filePath];

  releaseEntryDependencies(entryName);
  collectEntryDependencies(entryName);

  await buildEntry(entryName);
}

async function deleteEntryFile (filePath: string)
{
  hashes.setChanged(filePath);

  const entryName = entryReverses[filePath];

  releaseEntryDependencies(entryName);
  
  await buildEntry(entryName);
}

async function updateCodeFile (filePath: string)
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
      await buildEntry(entryName);  
    }
  }
}

async function deleteCodeFile (filePath: string)
{
  hashes.setChanged(filePath);

  if (entryDependencies[filePath])
  {
    const entryNames = entryDependencies[filePath];

    delete entryDependencies[filePath];

    for (const entryName of entryNames)
    {
      await buildEntry(entryName);  
    }
  }
}

async function updateModuleFile (filePath: string)
{
  if (!hashes.hasChanged(filePath))
  {
    // console.log('[skip]', filePath);
    return;
  }

  hashes.setChanged(filePath);

  await buildModule(filePath, true);
}

async function deleteModuleFile (filePath: string)
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
        await buildEntry(entryName);
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

async function buildModules ()
{
  for (const source of config.sources)
  {
    for (const moduleExtension of config.module.inputs)
    {
      const modulePattern = path.join(source.directory, '/**/*' + moduleExtension);
      const modulePaths = glob.sync(modulePattern);

      for (const modulePath of modulePaths)
      {
        await buildModule(modulePath, false);
      }
    }
  }
}

async function buildModule (filePath: string, shouldRebuildEntry: boolean)
{
  interface Data
  {
    entry?: string;
    default: Stylesheet;
  }

  function readFromScript (): Data
  {
    const entry = evaluator.getConst(filePath, 'entry');
    const src = evaluator.getConst(filePath, 'default');

    return {
      entry,
      default: src,
    };
  }

  const data = readFromScript();
  
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

    const { styles } = parseGlobalStyle(data.default);
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
      await buildEntry(entryName);
    }
  }
  else
  {
    const { modules, styles } = parseLocalStyle(data.default);
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

async function buildEntries ()
{
  for (const entryName in entries)
  {
    await buildEntry(entryName);
  }
}

async function buildEntry (entryName: string)
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

  const entryStyle = mergeStyles(entryStyles);
  const entryCSS = buildStyles(entryStyle);

  fsx.mkdirpSync(config.build.directory);

  const outPath = path.join(config.build.directory, entryName + '.css');
  const outData = await buildCSS(entryCSS);

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

async function buildCSS (input: string)
{
  try
  {
    const processor = postCSS([
      require('autoprefixer'),
      require('postcss-merge-rules'),
    ]);
  
    const result = await processor.process(input);
    return result.css || input;
  }
  catch
  {
    return input;
  }
}

function buildStyles (styles: Styles)
{
  function getSpace (indent: number)
  {
    return ''.padStart(indent, ' ');
  }

  function getIndex (token: string)
  {
    if (token.startsWith('*'))
    {
      return 1;
    }
    else if (token.startsWith(':root'))
    {
      return 2;
    }
    else if (token.startsWith('@page'))
    {
      return 3;
    }
    else if (token.startsWith('html'))
    {
      return 4;
    }
    else if (token.startsWith('body'))
    {
      return 5;
    }
    // 6 = tag
    else if (token.startsWith(':'))
    {
      return 7;
    }
    else if (token.startsWith('['))
    {
      return 8;
    }
    else if (token.startsWith('.'))
    {
      return 9;
    }
    else if (token.startsWith('#'))
    {
      return 10;
    }
    else if (token.startsWith('@media'))
    {
      return 11;
    }
    else if (token.startsWith('@supports'))
    {
      return 12;
    }

    // tag
    return 6;
  }

  function sort (css: string[])
  {
    return css.sort((a, b) =>
    {
      const ai = getIndex(a);
      const bi = getIndex(b);

      if (ai !== bi)
      {
        return ai - bi;
      }

      return a.localeCompare(b);
    });
  }

  function buildStyle (src: Styles, indent: number)
  {
    const css: string[] = [];
    const space = getSpace(indent);

    for (const key in src)
    {
      if (key.startsWith('@supports') || key.startsWith('@media'))
      {
        const value = buildStyle(src[key] as Styles, indent + 1);
        const token = `${space}${key} {\n${space} ${value}\n${space}}`;

        css.push(token);
      }
      else if (key.startsWith('@page'))
      {
        const values = src[key] as string[];
        const value = array.join(values, '; ');
        const token = `${space}${key} { ${value} }`;

        css.push(token);
      }
      else if (key.startsWith('@keyframes'))
      {
        const values = src[key] as string[];
        const value = array.join(values, ' ');
        const token = `${space}${key} { ${value} }`;

        css.push(token);
      }
      else
      {
        const selectors = src[key] as string[];
        const selector = array.join(sort(array.distinct(selectors)), ', ');
        const token = `${space}${selector} { ${key} }`;

        css.push(token);
      }
    }

    return array.join(sort(css), '\n');
  }

  return buildStyle(styles, 0);
}

function mergeStyles (entryStyles: Array<Styles>)
{
  function mergeStyle (src: Styles, dst: Styles)
  {
    for (const key in src)
    {
      if (key.startsWith('@supports') || key.startsWith('@media'))
      {
        if (!dst[key])
        {
          dst[key] = {};
        }

        const srcStyles = src[key] as Styles;
        const dstStyles = dst[key] as Styles;

        mergeStyle(srcStyles, dstStyles);
      }
      else if (key.startsWith('@page'))
      {
        if (!dst[key])
        {
          dst[key] = [];
        }

        const srcProps = src[key] as string[];
        const dstProps = dst[key] as string[];

        for (const prop of srcProps)
        {
          dstProps.push(prop);
        }
      }
      else
      {
        if (!dst[key])
        {
          dst[key] = [];
        }

        const srcSelectors = src[key] as string[];
        const dstSelectors = dst[key] as string[];

        for (const selector of srcSelectors)
        {
          dstSelectors.push(selector);
        }
      }
    }
  }

  function mergeTag (src: Styles)
  {
    const merges: Generic<string[]> = {};
    const dst: Styles = {};

    for (const key in src)
    {
      const val = src[key];

      if (key.startsWith('@'))
      {
        if (Array.isArray(val))
        {
          dst[key] = val;
        }
        else
        {
          dst[key] = mergeTag(val);
        }
      }
      else
      {
        const vals = val as string[];

        if (vals.length > 1)
        {
          dst[key] = vals;
        }
        else if (vals.length === 1)
        {
          if (vals[0].startsWith('.'))
          {
            dst[key] = vals;
          }
          else
          {
            if (!merges[vals[0]])
            {
              merges[vals[0]] = [];
            }

            merges[vals[0]].push(key);
          }
        }
      }
    }

    for (const selector in merges)
    {
      const property = array.join(merges[selector], '; ');
      dst[property] = [selector];
    }

    return dst;
  }

  const dst1: Styles = {};

  for (const src of entryStyles)
  {
    mergeStyle(src, dst1);
  }

  return mergeTag(dst1);
}

function parseGlobalStyle ({ stylesheet }: Stylesheet)
{
  const styles: Styles = {};

  function createRule (src: Rule, dst: Styles)
  {
    for (const declaration of src.declarations)
    {
      if (declaration.type === 'comment')
      {
        continue;
      }

      const token = declaration.property + ': ' + declaration.value;
      
      if (!dst[token])
      {
        dst[token] = [];
      }

      const selectors = dst[token] as string[];

      for (const selector of src.selectors)
      {
        selectors.push(selector);
      }
    }
  }

  function createKeyframes (src: Keyframes, dst: Styles)
  {
    const key = `@keyframes ${src.name}`;
    const tokens: string[] = [];

    for (const keyframe of src.keyframes)
    {
      if (keyframe.type === 'comment')
      {
        continue;
      }

      const properties: string[] = [];

      for (const declaration of keyframe.declarations)
      {
        if (declaration.type === 'comment')
        {
          continue;
        }

        properties.push(declaration.property + ': ' + declaration.value);
      }

      const selector = array.join(keyframe.values, ', ');
      const property = array.join(properties, '; ');
      
      tokens.push(`${selector} { ${property} }`);
    }

    dst[key] = tokens;
  }

  function createPage (src: Rule, dst: Styles)
  {
    const selectors = src.selectors.length > 0 ? src.selectors.map(e => '@page' + e) : ['@page'];

    for (const selector of selectors)
    {
      if (!dst[selector])
      {
        dst[selector] = [];
      }

      const props = dst[selector] as string[];

      for (const declaration of src.declarations)
      {
        if (declaration.type === 'comment')
        {
          continue;
        }

        const token = declaration.property + ': ' + declaration.value;
        props.push(token);
      }
    }
  }

  function createMedia (src: Media, dst: Styles)
  {
    const key = `@media ${src.media}`;

    if (!dst[key])
    {
      dst[key] = {};
    }

    for (const rule of src.rules)
    {
      create(rule, dst[key] as Styles);
    }
  }

  function createSupports (src: Supports, dst: Styles)
  {
    const key = `@supports ${src.supports}`;

    if (!dst[key])
    {
      dst[key] = {};
    }

    for (const rule of src.rules)
    {
      create(rule, dst[key] as Styles);
    }
  }

  function create (src: Supports | Media | Keyframes| Rule | Comment, dst: Styles)
  {
   if (src.type === 'supports')
    {
      createSupports(src, dst);
    }
    else if (src.type === 'media')
    {
      createMedia(src, dst);
    }
    else if (src.type === 'page')
    {
      createPage(src, dst);
    }
    else if (src.type === 'keyframes')
    {
      createKeyframes(src, dst);
    }
    else if (src.type === 'rule')
    {
      createRule(src, dst);
    }
  }

  for (const rule of stylesheet.rules)
  {
    create(rule, styles);  
  }

  return { styles };
}

function parseLocalStyle ({ stylesheet }: Stylesheet)
{
  const styles: Styles = {};
  const modules: Generic<string[]> = {};

  function createRule (src: Rule, dst: Styles, prefixes: string[])
  {
    for (const declaration of src.declarations)
    {
      if (declaration.type === 'comment')
      {
        continue;
      }
      
      const token = declaration.property + ': ' + declaration.value;
      
      if (!dst[token])
      {
        dst[token] = [];
      }

      const selectors = dst[token] as string[];

      for (const selector of src.selectors)
      {
        let module: string = '';
        let suffix: string = '';

        selector.replace(/module-[A-Za-z0-9-_]+/, (c, i) =>
        {
          module = c.slice(7);
          suffix = selector.slice(i + c.length);

          return c;
        });

        const key = array.join([...prefixes, declaration.property, declaration.value, suffix], '-');
        const id = incremental.get(key);

        if (!modules[module])
        {
          modules[module] = [];
        }

        modules[module].push(id);
        selectors.push('.' + id + suffix);
      }
    }
  }

  function createKeyframes (src: Keyframes, dst: Styles)
  {
    const key = `@keyframes ${src.name}`;
    const tokens: string[] = [];

    for (const keyframe of src.keyframes)
    {
      if (keyframe.type === 'comment')
      {
        continue;
      }

      const properties: string[] = [];

      for (const declaration of keyframe.declarations)
      {
        if (declaration.type === 'comment')
        {
          continue;
        }

        properties.push(declaration.property + ': ' + declaration.value);
      }

      const selector = array.join(keyframe.values, ', ');
      const property = array.join(properties, '; ');
      
      tokens.push(`${selector} { ${property} }`);
    }

    dst[key] = tokens;
  }

  function createPage (src: Rule, dst: Styles)
  {
    const selectors = src.selectors.length > 0 ? src.selectors.map(e => '@page' + e) : ['@page'];

    for (const selector of selectors)
    {
      if (!dst[selector])
      {
        dst[selector] = [];
      }

      const props = dst[selector] as string[];

      for (const declaration of src.declarations)
      {
        if (declaration.type === 'comment')
        {
          continue;
        }

        const token = declaration.property + ': ' + declaration.value;
        props.push(token);
      }
    }
  }

  function createMedia (src: Media, dst: Styles, prefixes: string[])
  {
    const key = `@media ${src.media}`;

    if (!dst[key])
    {
      dst[key] = {};
    }

    for (const rule of src.rules)
    {
      create(rule, dst[key] as Styles, [...prefixes, src.media]);
    }
  }

  function createSupports (src: Supports, dst: Styles, prefixes: string[])
  {
    const key = `@supports ${src.supports}`;

    if (!dst[key])
    {
      dst[key] = {};
    }

    for (const rule of src.rules)
    {
      create(rule, dst[key] as Styles, [...prefixes, src.supports]);
    }
  }

  function create (src: Supports | Media | Keyframes | Rule | Comment, dst: Styles, prefixes: string[])
  {
   if (src.type === 'supports')
    {
      createSupports(src, dst, prefixes);
    }
    else if (src.type === 'media')
    {
      createMedia(src, dst, prefixes);
    }
    else if (src.type === 'page')
    {
      createPage(src, dst);
    }
    else if (src.type === 'keyframes')
    {
      createKeyframes(src, dst);
    }
    else if (src.type === 'rule')
    {
      createRule(src, dst, prefixes);
    }
  }

  for (const rule of stylesheet.rules)
  {
    create(rule, styles, []);  
  }

  const _modules: Generic<string> = {};

  for (const module in modules)
  {
    _modules[module] = array.join(modules[module], ' ');
  }
  
  return {
    modules: _modules,
    styles,
  };
}