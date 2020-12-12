import { CSSValues, CSSValue, Generic } from './types';
import { join } from './array';

function merge (src: CSSValues, dst: CSSValues)
{
  for (const key in src)
  {
    const value = src[key];

    if (key.startsWith('@page'))
    {
      if (!dst[key])
      {
        dst[key] = [];
      }

      const srcArr = value as (Array<string>);
      const dstArr = dst[key] as (Array<string>);

      for (const e of srcArr)
      {
        dstArr.push(e);
      }
    }
    else if (key.startsWith('@'))
    {
      if (!dst[key])
      {
        dst[key] = {};
      }

      merge(value as CSSValues, dst[key] as CSSValues);
    }
    else
    {
      if (!dst[key])
      {
        dst[key] = [];
      }

      const srcArr = value as (Array<CSSValue>);
      const dstArr = dst[key] as (Array<CSSValue>);

      for (const e of srcArr)
      {
        dstArr.push(e);
      }
    }
  }
}

const indices = [ ':r', '@p', '@m', '@s' ];

function sortKeys (keys: string[])
{
  return keys.sort((a, b) => {
    const a0 = a[0] + a[1];
    const b0 = b[0] + b[1];

    const ai = indices.indexOf(a0);
    const bi = indices.indexOf(b0);

    return ai - bi;
  });
}

function sortValues (src: CSSValues)
{
  const keys = sortKeys(Object.keys(src));
  const dst: CSSValues = {};

  for (const key of keys)
  {
    if (Array.isArray(src[key]))
    {
      dst[key] = src[key];
    }
    else
    {
      dst[key] = sortValues(src[key] as CSSValues);
    }
  }

  return dst;
}

function mergeTags (src: CSSValues)
{
  const deepKeys: string[] = [];
  const tagKeys: Generic<string[]> = {};

  for (const key in src)
  {
    const value = src[key];

    if (key.startsWith('@page'))
    {
      continue;
    }
    else if (key.startsWith('@'))
    {
      deepKeys.push(key);
    }
    else if (Array.isArray(value) && value.length === 1 && typeof value[0] !== 'string' && value[0].type === 'tag' && !value[0].selector)
    {
      if (!tagKeys[value[0].name])
      {
        tagKeys[value[0].name] = [];
      }

      tagKeys[value[0].name].push(key);
    }
  }

  for (const tag in tagKeys)
  {
    for (const key of tagKeys[tag])
    {
      delete src[key];
    }

    const newKey = join(tagKeys[tag], '; ');
    const newValue: CSSValue = {
      type: 'tag',
      name: tag,
    };

    src[newKey] = [newValue];
  }

  for (const deepKey of deepKeys)
  {
    if (src[deepKey] && typeof src[deepKey] === 'object')
    {
      mergeTags(src[deepKey] as CSSValues);
    }
  }
}

function mergeValues (srcs: CSSValues[])
{
  const dst: CSSValues = {};

  for (const src of srcs)
  {
    merge(src, dst);  
  }
  
  mergeTags(dst);

  return sortValues(dst);
}

export default mergeValues;