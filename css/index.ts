import collect from './collect';

import toObject from './to-object';
import toSource from './to-source';

function css (css: TemplateStringsArray, ...values: unknown[])
{
  const source = toSource(css, values);
  const obj = toObject(source);

  return collect(obj);
}

export default css;