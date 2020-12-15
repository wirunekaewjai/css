import { CSSStyle } from './types/css';

import { join } from './utils/array';
import { hex, rgb } from './utils/color';
import { global } from './utils/global';
import { length } from './utils/length';

type Shadow = {
  inset?: boolean;
  x?: string;
  y?: string;
  blur?: string;
  spread?: string;
  color?: string;
};

function create_box_shadow ()
{
  const enums = {
    'none': '0 0 transparent',
    'xs': `0 1px 2px 0 rgba(0, 0, 0, 0.05)`,
    'sm': `0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)`,
    'md': `0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)`,
    'lg': `0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)`,
    'xl': `0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)`,
    '2xl': `0 25px 50px -12px rgba(0, 0, 0, 0.25)`,

    hex,
    rgb,
    length,

    ...global,
  };

  type Enums = typeof enums;
  type V = string | Shadow | (string | Shadow)[];
  type Fn = (e: Enums) => V;

  function getS (s: string | Shadow)
  {
    if (typeof s === 'string')
    {
      return s;
    }

    const arr = [
      s.inset ? 'inset' : undefined,
      s.x,
      s.y,
      s.blur,
      s.spread,
      s.color
    ];

    return join(arr, ' ');
  }

  function getValues (value: V)
  {
    if (Array.isArray(value))
    {
      return value.map(e => getS(e));
    }

    return [getS(value)];
  }

  return (shadow: Fn | V): CSSStyle =>
  {
    const r = typeof shadow === 'function' ? getValues(shadow(enums)) : getValues(shadow);
    const a = Array.isArray(r) ? join(r, ', ') : r;
  
    return [`box-shadow: ${a}`];
  }
}

export const box_shadow = create_box_shadow();