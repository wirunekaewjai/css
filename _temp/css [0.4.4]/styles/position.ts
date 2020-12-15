import { CSSStyle } from './types/css';

import { global } from './utils/global';
import { toREM } from './utils/length';

const insetEnums = {
  auto: 'auto',

  ...global,
};

type InsetEnums = typeof insetEnums;

function create_position ()
{
  const enums = {
    fixed: 'fixed',
    static: 'static',
    absolute: 'absolute',
    relative: 'relative',

    sticky: [
      '-webkit-sticky',
      'sticky',
    ],

    ...global,
  };

  type Enums = typeof enums;
  type Fn = (e: Enums) => string | string[];
  
  return (position: Fn | string | string[]): CSSStyle =>
  {
    const a = typeof position === 'function' ? position(enums) : position;
  
    if (Array.isArray(a))
    {
      return [
        a.map(e => `position: ${e}`),
      ];
    }

    return [`position: ${a}`];
  }
}

function getInsetValue (v: number | string)
{
  if (typeof v === 'string')
  {
    return v
  }
 
  return (v * toREM) + 'rem';
}

function create_inset_rect ()
{
  type M = number | string;
  type V = M | [M, M?, M?, M?];
  type Fn = (e: InsetEnums) => V;

  function getValues (v: M | [M, M?, M?, M?])
  {
    if (Array.isArray(v))
    {
      const [t, r, b, l] = v;
      const tt = getInsetValue(t);
      const rr = getInsetValue(r ?? tt);
      const bb = getInsetValue(b ?? tt);
      const ll = getInsetValue(l ?? rr);

      return [tt, rr, bb, ll];
    }
    else
    {
      const vv = getInsetValue(v);
      return [vv, vv, vv, vv];
    }
  }

  return (inset: Fn | V): CSSStyle =>
  {
    const a = typeof inset === 'function' ? getValues(inset(insetEnums)) : getValues(inset);
  
    return [
      `top: ${a[0]}`,
      `right: ${a[1]}`,
      `bottom: ${a[2]}`,
      `left: ${a[3]}`,
    ];
  }
}

function create_inset_axis (names: [string, string])
{
  type M = number | string;
  type V = M | [M, M?];
  type Fn = (e: InsetEnums) => V;

  function getValues (v: M | [M, M?])
  {
    if (Array.isArray(v))
    {
      const [l, r] = v;
      const ll = getInsetValue(l);
      const rr = getInsetValue(r ?? ll);

      return [ll, rr];
    }
    else
    {
      const vv = getInsetValue(v);
      return [vv, vv];
    }
  }

  return (axis: Fn | V): CSSStyle =>
  {
    const a = typeof axis === 'function' ? getValues(axis(insetEnums)) : getValues(axis);
  
    return [
      `${names[0]}: ${a[0]}`,
      `${names[1]}: ${a[1]}`,
    ];
  }
}

function create_inset (name: string)
{
  type V = number | string;
  type Fn = (e: InsetEnums) => V;

  return (value: Fn | V): CSSStyle =>
  {
    const a = typeof value === 'function' ? getInsetValue(value(insetEnums)) : getInsetValue(value);
  
    return [
      `${name}: ${a}`,
    ];
  }
}

export const position = create_position();

export const inset = create_inset_rect();
export const inset_x = create_inset_axis(['left', 'right']);
export const inset_y = create_inset_axis(['top', 'bottom']);

export const top = create_inset('top');
export const right = create_inset('right');
export const bottom = create_inset('bottom');
export const left = create_inset('left');