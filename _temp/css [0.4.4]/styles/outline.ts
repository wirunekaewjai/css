import { BorderStyle } from './types/border-style';
import { CSSStyle } from './types/css';

import { join } from './utils/array';
import { hex, rgb } from './utils/color';
import { global } from './utils/global';
import { toREM } from './utils/length';

function create_outline ()
{
  type OutlineStyle = 'auto' | BorderStyle;
  
  type Outline = {
    width?: string,
    style?: OutlineStyle,
    color?: string,
  };

  const enums = {
    none: 'none',
    auto: 'auto',
    solid: 'solid',
    dashed: 'dashed',
    dotted: 'dotted',
    double: 'double',

    hex,
    rgb,

    ...global,
  };

  type Enums = typeof enums;
  type V = string | Outline | string[];
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

    return join([v.color, v.style, v.width], ' ');
  }

  return (outline: Fn | V): CSSStyle =>
  {
    const a = typeof outline === 'function' ? getValue(outline(enums)) : getValue(outline);

    return [`outline: ${a}`];
  }
}

function create_outline_color ()
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

    return [`outline-color: ${a}`];
  }
}

function create_outline_style ()
{
  const enums = {
    none: 'none',
    auto: 'auto',
    solid: 'solid',
    dashed: 'dashed',
    dotted: 'dotted',
    double: 'double',

    ...global,
  };

  type Enums = typeof enums;
  type Fn = (e: Enums) => string;

  return (style: Fn | string): CSSStyle =>
  {
    const a = typeof style === 'function' ? style(enums) : style;

    return [`outline-style: ${a}`];
  }
}

function create_outline_width ()
{
  const enums = {
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

  return (width: Fn | number | string): CSSStyle =>
  {
    const a = typeof width === 'function' ? getValue(width(enums)) : getValue(width);

    return [`outline-width: ${a}`];
  }
}

function create_outline_offset ()
{
  const enums = {
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
    
    return (v * toREM) + 'rem';
  }

  return (offset: Fn | number | string): CSSStyle =>
  {
    const a = typeof offset === 'function' ? getValue(offset(enums)) : getValue(offset);

    return [`outline-offset: ${a}`];
  }
}

export const outline = create_outline();
export const outline_color = create_outline_color();
export const outline_style = create_outline_style();
export const outline_width = create_outline_width();
export const outline_offset = create_outline_offset();