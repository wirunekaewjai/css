import collect from './collect';
// import collectImport from './collect-import';

import toObject from './to-object';
import toSource from './to-source';

import { CSSCollection } from './types';

function css (css: TemplateStringsArray, ...values: unknown[])
{
  const source = toSource(css, values);
  const obj = toObject(source);

  return collect(obj);
}

export function cssFromString (source: string): CSSCollection
{
  if (!source || source.trim().length === 0)
  {
    return {
      slugs: {},
      values: {},
    };
  }

  const obj = toObject(source);

  return collect(obj);
}

export default css;