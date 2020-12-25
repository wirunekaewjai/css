import array from '../../utils/array';
import { Styles } from '../types';

export default function buildStyles (styles: Styles)
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
