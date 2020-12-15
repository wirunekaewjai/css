import { CSSValues, CSSValue } from './types';

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

function mergeValues (srcs: CSSValues[])
{
  const dst: CSSValues = {};

  for (const src of srcs)
  {
    merge(src, dst);  
  }
  
  return dst;
}

export default mergeValues;