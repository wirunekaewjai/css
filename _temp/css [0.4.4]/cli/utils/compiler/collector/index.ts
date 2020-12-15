import evaluator from '../../evaluator';

import { CSS, CSSStyle } from '../../../../styles/types/css';

import toAscii from './to-ascii';
import toReadable from './to-readable';

interface Generic<T> {
  [key: string]: T;
}

export interface Collection {
  names: Generic<string>;
  values: Generic<Generic<string[]>>;
}

let maps: Generic<string> = {};
let increment = 0;
let draft = false;

function getID (name: string)
{
  if (!maps[name])
  {
    maps[name] = toAscii(increment++);
  }

  const n = maps[name];

  if (draft)
  {
    return n + '-' + toReadable(name);
  }

  return n;
}

function init (isDraft: boolean)
{
  maps = {};
  increment = 0;

  draft = isDraft;
}

function collect (sourcePath: string): Collection
{
  const css = (evaluator.getDefault(sourcePath) ?? []) as CSS;

  const names: Generic<string> = {};
  const values: Generic<Generic<string[]>> = {};

  function join (arr: string[], sep: string = '')
  {
    return arr.filter(e => !!e).join(sep).trim();
  }

  function addValue (screen: string, value: string, id: string)
  {
    if (!values[screen])
    {
      values[screen] = {};
    }

    if (!values[screen][value])
    {
      values[screen][value] = [];
    }

    values[screen][value].push(id);
  }

  for (const name in css)
  {
    const classes: string[] = [];
    const sheets = css[name];

    function addClass (id: string)
    {
      classes.push(id);
    }

    for (const sheet of sheets)
    {
      const screen = sheet.screen ?? '$';

      function addStyles (styles: CSSStyle[], selectors: string[])
      {
        for (const style of styles)
        {
          addStyle(style, selectors);
        }
      }

      function addStyle (style: CSSStyle, selectors: string[])
      {
        if (!style)
        {
          return;
        }

        if (typeof style === 'string')
        {
          const classToken = join([screen, ...selectors, style], '-');
          const className = getID(classToken);
          const classSelector = join(['.' + className, ...selectors]);

          addClass(className);
          addValue(screen, style, classSelector);
        }
        else if (Array.isArray(style))
        {
          for (const prop of style)
          {
            const classValue = typeof prop === 'string' ? prop : join(prop, '; ');

            const classToken = join([screen, ...selectors, classValue], '-');
            const className = getID(classToken);
            const classSelector = join(['.' + className, ...selectors]);

            addClass(className);
            addValue(screen, classValue, classSelector);
          }
        }
        else if (typeof style === 'object')
        {
          for (const [k, v] of Object.entries(style))
          {
            addStyles(v, [...selectors, k]);
          }
        }
      }

      addStyles(sheet.styles, []);
    }

    names[name] = classes.join(' ').trim();
  }

  return {
    names,
    values,
  };
}

export default {
  init,
  collect,
}