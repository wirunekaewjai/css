import { BorderStyle } from '../types/border-style';
import { CSSStyle } from '../types/css';

import { join } from './array';
import { system, hex, rgb } from './color';
import { global } from './global';
import { toREM } from './length';

type Border = {
  width?: string,
  style?: BorderStyle,
  color?: string,
};

export function create_border<T extends object> (name: string, extraEnums?: T)
{
  const e = {
    none: 'none',
    solid: 'solid',
    dashed: 'dashed',
    dotted: 'dotted',
    double: 'double',
    hex,
    rgb,
  };

  const enums = Object.assign({}, e, extraEnums);

  type Enums = typeof enums & T;
  type V = string | Border | string[];
  type Fn = (e: Enums) => V;

  function getValue (v: V)
  {
    if (typeof v === 'string')
    {
      return v;
    }
    else if (Array.isArray(v))
    {
      return join(v, ' ');
    }

    return join([v.width, v.style, v.color], ' ');
  }

  return (border: Fn | V): CSSStyle =>
  {
    const a = typeof border === 'function' ? getValue(border(enums)) : getValue(border);

    return [`${name}: ${a}`];
  }
}

export function create_border_color<V extends string | string[]> (name: string)
{
  const enums = {
    hex,
    rgb,

    ...system,
    ...global,
  };

  type Enums = typeof enums;
  type Fn = (e: Enums) => V;

  function getValue (v: string | string[])
  {
    if (typeof v === 'string')
    {
      return v;
    }

    return join(v, ' ');
  }

  return (color: Fn | V): CSSStyle =>
  {
    const a = typeof color === 'function' ? getValue(color(enums)) : getValue(color);

    return [`${name}: ${a}`];
  }
}

export function create_border_style<V extends string | string[]> (name: string)
{
  const enums = {
    none: 'none',
    solid: 'solid',
    dashed: 'dashed',
    dotted: 'dotted',
    double: 'double',

    ...global,
  };

  type Enums = typeof enums;
  type Fn = (e: Enums) => V;

  function getValue (v: string | string[])
  {
    if (typeof v === 'string')
    {
      return v;
    }
    
    return join(v, ' ');
  }

  return (style: Fn | V): CSSStyle =>
  {
    const a = typeof style === 'function' ? getValue(style(enums)) : getValue(style);

    return [`${name}: ${a}`];
  }
}

export function create_border_width<V extends number | string | string[]> (name: string)
{
  const enums = {
    ...global,
  };

  type Enums = typeof enums;
  type Fn = (e: Enums) => V;

  function getValue (v: number | string | string[])
  {
    if (typeof v === 'string')
    {
      return v;
    }
    else if (typeof v === 'number')
    {
      return v + 'px';
    }
    
    return join(v, ' ');
  }

  return (width: Fn | V): CSSStyle =>
  {
    const a = typeof width === 'function' ? getValue(width(enums)) : getValue(width);

    return [`${name}: ${a}`];
  }
}

export function create_border_radius<V extends number | string | string[]> (names: string[])
{
  const enums = {
    'none': 'none',
    'rounded': '9999px',
    'xs': `${0.5 * toREM}rem`,
    'sm': `${1 * toREM}rem`,
    'md': `${1.5 * toREM}rem`,
    'lg': `${2 * toREM}rem`,
    'xl': `${3 * toREM}rem`,
    '2xl': `${4 * toREM}rem`,
    '3xl': `${6 * toREM}rem`,

    ...global,
  };

  type Enums = typeof enums;
  type Fn = (e: Enums) => V;

  function getValue (v: number | string | string[])
  {
    if (typeof v === 'string')
    {
      return v;
    }
    else if (typeof v === 'number')
    {
      return v + 'px';
    }
    
    return join(v, ' ');
  }

  return (radius: Fn | V): CSSStyle =>
  {
    const a = typeof radius === 'function' ? getValue(radius(enums)) : getValue(radius);

    return names.map(name => `${name}: ${a}`);
  }
}