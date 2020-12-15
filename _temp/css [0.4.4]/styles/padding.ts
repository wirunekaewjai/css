import { CSSStyle } from './types/css';
import { global } from './utils/global';
import { toREM } from './utils/length';

const enums = {
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

  return (padding: Fn | V): CSSStyle =>
  {
    const a = typeof padding === 'function' ? getValues(padding(enums)) : getValues(padding);
  
    return [
      `padding-top: ${a[0]}`,
      `padding-right: ${a[1]}`,
      `padding-bottom: ${a[2]}`,
      `padding-left: ${a[3]}`,
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
      `padding-${names[0]}: ${a[0]}`,
      `padding-${names[1]}: ${a[1]}`,
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
      `padding-${name}: ${a}`,
    ];
  }
}

export const padding = create_rect();
export const padding_x = create_axis(['left', 'right']);
export const padding_y = create_axis(['top', 'bottom']);
export const padding_top = create('top');
export const padding_right = create('right');
export const padding_bottom = create('bottom');
export const padding_left = create('left');