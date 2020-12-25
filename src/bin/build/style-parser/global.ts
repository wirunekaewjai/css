import array from '../../utils/array';

import { Stylesheet, Supports, Media, Keyframes, Rule, Comment } from '../../../utils/css/parse/types';
import { Styles } from '../types';

export default function parse ({ stylesheet }: Stylesheet)
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