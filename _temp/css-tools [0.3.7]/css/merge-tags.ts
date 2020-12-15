import { CSSValues, CSSValue, Generic } from './types';
import { join } from './array';

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

  return src;
}

export default mergeTags;