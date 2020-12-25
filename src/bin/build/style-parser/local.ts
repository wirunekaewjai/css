
import Incremental from '../../utils/incremental';
import array from '../../utils/array';

import { Stylesheet, Supports, Media, Keyframes, Rule, Comment } from '../../../utils/css/parse/types';
import { Generic, Styles } from '../types';

let incremental: Incremental;

function init ()
{
  incremental = new Incremental();
}

function parse ({ stylesheet }: Stylesheet)
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

export default {
  init,
  parse,
}