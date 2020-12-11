import { CSSObject, CSSCollection, CSSSlugs, CSSValues, CSSValue } from './types';
import { defined, join } from './array';

function parse (css: CSSObject): CSSCollection
{
  const slugs: CSSSlugs = {};
  const values: CSSValues = {};

  function getSelector (text: string) : [string, string?]
  {
    const tokens: string[] = [];

    text.replace(/^[A-Za-z0-9-_]+/, (c) =>
    {
      tokens.push(c);
      return c;
    });

    if (tokens.length > 0)
    {
      const name = tokens[0];

      if (name.length < text.length)
      {
        return [
          name,
          text.slice(name.length),
        ];
      }
    }

    return [text];
  }

  function parseProperties (src: CSSObject, groups: string[], selectors: string[], name?: string)
  {
    for (const key in src)
    {
      const value = src[key];

      if (typeof value === 'string')
      {
        if (name)
        {
          const selector = selectors.join('');
          const property = `${join([key, value], ': ')}`;
          const slug = join([...groups, property, ...selectors], ' ');

          let obj: CSSValues = values;

          for (const group of groups)
          {
            if (!obj[group])
            {
              obj[group] = {};
            }

            obj = obj[group] as CSSValues;
          }

          if (!obj[property])
          {
            obj[property] = [];
          }

          const arr = obj[property] as CSSValue[];

          let val: CSSValue;

          if (name.startsWith('module-'))
          {
            const n = name.slice(7);

            if (!slugs[n])
            {
              slugs[n] = [];
            }

            slugs[n].push(slug);
            
            val = {
              type: 'slug',
              name: slug,
            };
          }
          else
          {
            val = {
              type: 'tag',
              name,
            };
          }

          if (selector?.length > 0)
          {
            val.selector = selector;
          }

          arr.push(val);
        }
      }
      else if (key.startsWith('@page'))
      {
        let obj: CSSValues = values;

        for (const group of groups)
        {
          if (!obj[group])
          {
            obj[group] = {};
          }

          obj = obj[group] as CSSValues;
        }

        if (!obj[key])
        {
          obj[key] = [];
        }

        const items = obj[key] as string[];
        
        for (const e in value)
        {
          items.push(join([e, value[e]], ': '));
        }
      }
      else if (key.startsWith('@'))
      {
        parseProperties(value, defined([...groups, key]), selectors, name);
      }
      else
      {
        const [name, suffix] = getSelector(key);

        parseProperties(value, groups, defined([...selectors, suffix]), name);
      }
    }
  }

  parseProperties(css, [], []);

  return {
    slugs,
    values,
  };
}

export default parse;