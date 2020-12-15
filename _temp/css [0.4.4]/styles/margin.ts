import { CSSStyle } from './types/css';

import { global } from './utils/global';
import { toREM } from './utils/length';

const enums = {
  auto: 'auto',

  ...global,
};

type Enums = typeof enums;

function getValue (v: number | string)
{
  if (typeof v === 'string')
  {
    return v
  }
 
  return (v * toREM) + 'rem';
}

function create_rect ()
{
  type M = number | string;
  type V = M | [M, M?, M?, M?];
  type Fn = (e: Enums) => V;

  function getValues (v: M | [M, M?, M?, M?])
  {
    if (Array.isArray(v))
    {
      const [t, r, b, l] = v;
      const tt = getValue(t);
      const rr = getValue(r ?? tt);
      const bb = getValue(b ?? tt);
      const ll = getValue(l ?? rr);

      return [tt, rr, bb, ll];
    }
    else
    {
      const vv = getValue(v);
      return [vv, vv, vv, vv];
    }
  }

  return (margin: Fn | V): CSSStyle =>
  {
    const a = typeof margin === 'function' ? getValues(margin(enums)) : getValues(margin);
  
    return [
      `margin-top: ${a[0]}`,
      `margin-right: ${a[1]}`,
      `margin-bottom: ${a[2]}`,
      `margin-left: ${a[3]}`,
    ];
  }
}

function create_axis (names: [string, string])
{
  type M = number | string;
  type V = M | [M, M?];
  type Fn = (e: Enums) => V;

  function getValues (v: M | [M, M?])
  {
    if (Array.isArray(v))
    {
      const [l, r] = v;
      const ll = getValue(l);
      const rr = getValue(r ?? ll);

      return [ll, rr];
    }
    else
    {
      const vv = getValue(v);
      return [vv, vv];
    }
  }

  return (axis: Fn | V): CSSStyle =>
  {
    const a = typeof axis === 'function' ? getValues(axis(enums)) : getValues(axis);
  
    return [
      `margin-${names[0]}: ${a[0]}`,
      `margin-${names[1]}: ${a[1]}`,
    ];
  }
}

function create (name: string)
{
  type V = number | string;
  type Fn = (e: Enums) => V;

  return (value: Fn | V): CSSStyle =>
  {
    const a = typeof value === 'function' ? getValue(value(enums)) : getValue(value);
  
    return [
      `margin-${name}: ${a}`,
    ];
  }
}

export const margin = create_rect();
export const margin_x = create_axis(['left', 'right']);
export const margin_y = create_axis(['top', 'bottom']);
export const margin_top = create('top');
export const margin_right = create('right');
export const margin_bottom = create('bottom');
export const margin_left = create('left');