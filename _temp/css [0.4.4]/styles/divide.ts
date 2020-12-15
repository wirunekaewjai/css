import { CSSStyle } from './types/css';
import { system, hex, rgb } from './utils/color';
import { global } from './utils/global';

const child = ' > * + *';

function create_color ()
{
  const enums = {
    hex,
    rgb,

    ...system,
    ...global,
  };

  type Enums = typeof enums;
  type Fn = (e: Enums) => string;

  return (color: Fn | string): CSSStyle =>
  {
    const c = typeof color === 'function' ? color(enums) : color;

    return {
      [child]: [`border-color: ${c}`],
    };
  }
}

function create_style ()
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
  type Fn = (e: Enums) => string;

  return (style: Fn | string): CSSStyle =>
  {
    const c = typeof style === 'function' ? style(enums) : style;

    return {
      [child]: [`border-style: ${c}`],
    };
  }
}

function create_width (name: string)
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

    return {
      [child]: [`${name}: ${a}`],
    };
  }
}

export const divide_color = create_color();
export const divide_style = create_style();
export const divide_x = create_width('border-left-width');
export const divide_y = create_width('border-top-width');
export const divide_reverse_x = create_width('border-right-width');
export const divide_reverse_y = create_width('border-bottom-width');