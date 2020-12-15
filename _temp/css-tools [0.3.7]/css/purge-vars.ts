import { CSSValues } from './types';

function collectUsages (src: CSSValues, usages: string[])
{
  for (const key in src)
  {
    if (key.indexOf('var(--') >= 0)
    {
      key.replace(/--[A-Za-z0-9-_]+/g, (c) =>
      {
        usages.push(c);
        return c;
      });
    }
    else if (key.startsWith('@page'))
    {
      const values = src[key] as string[];

      for (const value of values)
      {
        if (value.indexOf('var(--') >= 0)
        {
          value.replace(/--[A-Za-z0-9-_]+/g, (c) =>
          {
            usages.push(c);
            return c;
          });
        }
      }
    }
    else if (key.startsWith('@'))
    {
      collectUsages(src[key] as CSSValues, usages);
    }
  }
}

function cleanVars (src: CSSValues, usages: string[])
{
  for (const key in src)
  {
    if (key.startsWith('--'))
    {
      const v = key.split(':')[0];

      if (!usages.includes(v))
      {
        delete src[key];
      }
    }
    else if (key.startsWith('@page'))
    {
      continue;
    }
    else if (key.startsWith('@'))
    {
      cleanVars(src[key] as CSSValues, usages);
    }
  }
}

function purge (src: CSSValues)
{
  const usages: string[] = [];

  collectUsages(src, usages);
  cleanVars(src, usages);

  return src;
}

export default purge;