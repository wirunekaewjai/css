import { CSSStyle } from './types/css';

import {
  TextDecorationLine,
  TextDecorationStyle,
  // TextDecorationThickness,
} from './types/text-decoration';

import { join } from './utils/array';
import { hex, rgb } from './utils/color';
import { global } from './utils/global';

function create_decoration ()
{
  type Decoration = [string, TextDecorationStyle, ...TextDecorationLine[]];

  const enums = {
    none: 'none',

    hex,
    rgb,

    ...global,
  };

  type Enums = typeof enums;
  type V = string | Decoration;
  type Fn = (e: Enums) => V;

  function getValue (v: string | Decoration)
  {
    if (typeof v === 'string')
    {
      return v;
    }

    return join(v, ' ');
  }

  return (decor: Fn | string | Decoration): CSSStyle =>
  {
    const a = typeof decor === 'function' ? getValue(decor(enums)) : getValue(decor);

    return [`text-decoration: ${a}`];
  }
}

function create_line ()
{
  const enums = {
    none: 'none',
    underline: 'underline',
    overline: 'overline',
    line_through: 'line-through',
  };

  type Enums = typeof enums;
  type Fn = (e: Enums) => string | string[];

  return (line: Fn | string | string[]): CSSStyle =>
  {
    const l = typeof line === 'function' ? line(enums) : line;
    const a = Array.isArray(l) ? join(l, ' ') : l;

    return [`text-decoration-line: ${a}`];
  };
}

function create_style ()
{
  const enums = {
    wavy: 'wavy',
    solid: 'solid',
    double: 'double',
    dotted: 'dotted',
    dashed: 'dashed',
    
    ...global,
  };

  type Enums = typeof enums;
  type Fn = (e: Enums) => string | string[];

  return (style: Fn | string | string[]): CSSStyle =>
  {
    const l = typeof style === 'function' ? style(enums) : style;
    const a = Array.isArray(l) ? join(l, ' ') : l;

    return [`text-decoration-style: ${a}`];
  };
}

function create_color ()
{
  const enums = {
    hex,
    rgb,

    ...global,
  };

  type Enums = typeof enums;
  type Fn = (e: Enums) => string;

  return (color: Fn | string): CSSStyle =>
  {
    const a = typeof color === 'function' ? color(enums) : color;

    return [`text-decoration-color: ${a}`];
  }
}

function create_thickness ()
{
  const enums = {
    auto: 'auto',
    from_font: 'from-font',

    ...global,
  };

  type Enums = typeof enums;
  type Fn = (e: Enums) => number | string;

  function getValue (v: number | string)
  {
    if (typeof v === 'string')
    {
      return v;
    }
    
    return v + 'px';
  }

  return (thickness: Fn | number | string): CSSStyle =>
  {
    const a = typeof thickness === 'function' ? getValue(thickness(enums)) : getValue(thickness);

    return [`text-decoration-thickness: ${a}`];
  }
}

export const text_decoration = create_decoration();
export const text_decoration_line = create_line();
export const text_decoration_style = create_style();
export const text_decoration_color = create_color();
export const text_decoration_thickness = create_thickness();