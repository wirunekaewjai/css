import { CSSStyle } from './types/css';

import { global } from './utils/global';
import { toREM } from './utils/length';

function create_family ()
{
  const enums = {
    sans: 'var(--font-sans)',
    serif: 'var(--font-serif)',
    mono: 'var(--font-mono)',

    ...global,
  };

  type Enums = typeof enums;
  type V = string | string[];
  type Fn = (e: Enums) => V;

  return (family: Fn | V): CSSStyle =>
  {
    const f = typeof family === 'function' ? family(enums) : family;
    const a = Array.isArray(f) ? f.join(', ') : f;

    return [`font-family: ${a}`];
  };
}

function create_size ()
{
  type Numbers = [number, number];

  const enums = {
    'xs': [3, 4] as Numbers,
    'sm': [3.5, 5] as Numbers,
    'md': [4, 6] as Numbers,
    'lg': [4.5, 7] as Numbers,
    'xl': [5, 7] as Numbers,
    '2xl': [6, 8] as Numbers,
    '3xl': [7.5, 9] as Numbers,
    '4xl': [9, 10] as Numbers,
    '5xl': [12, 12] as Numbers,
    '6xl': [15, 15] as Numbers,
    '7xl': [18, 18] as Numbers,
    '8xl': [24, 24] as Numbers,
    '9xl': [32, 32] as Numbers,

    ...global,
  };

  type Enums = typeof enums;
  type V = string | number | Numbers;
  type Fn = (e: Enums) => V;

  function getValue (v: string | number | Numbers)
  {
    if (typeof v === 'string')
    {
      return v;
    }
    else if (typeof v === 'number')
    {
      return v + 'em';
    }

    return [
      (v[0] * toREM) + 'rem',
      (v[1] * toREM) + 'rem',
    ];
  }

  return (size: Fn | V): CSSStyle =>
  {
    const a = typeof size === 'function' ? getValue(size(enums)) : getValue(size);

    if (Array.isArray(a))
    {
      return [
        `font-size: ${a[0]}`,
        `line-height: ${a[1]}`,
      ];
    }
    
    return [`font-size: ${a}`];
  };
}

function create_style ()
{
  const enums = {
    normal: 'normal',
    italic: 'italic',

    ...global,
  };

  type Enums = typeof enums;
  type V = string;
  type Fn = (e: Enums) => V;

  return (style: Fn | V): CSSStyle =>
  {
    const a = typeof style === 'function' ? style(enums) : style;

    return [`font-style: ${a}`];
  };
}

function create_weight ()
{
  type Weight = 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900;

  const enums = {
    thin: 100 as Weight,
    extralight: 200 as Weight,
    light: 300 as Weight,
    normal: 400 as Weight,
    medium: 500 as Weight,
    semibold: 600 as Weight,
    bold: 700 as Weight,
    extrabold: 800 as Weight,
    black: 900 as Weight,

    ...global,
  };

  type Enums = typeof enums;
  type V = string | Weight;
  type Fn = (e: Enums) => V;

  return (weight: Fn | V): CSSStyle =>
  {
    const a = typeof weight === 'function' ? weight(enums) : weight;

    return [`font-weight: ${a}`];
  };
}

function create_line_height ()
{
  const enums = {
    normal: 'normal',

    ...global,
  };

  type Enums = typeof enums;
  type V = string | number;
  type Fn = (e: Enums) => V;

  return (height: Fn | V): CSSStyle =>
  {
    const a = typeof height === 'function' ? height(enums) : height;

    return [`line-height: ${a}`];
  };
}

export const font_family = create_family();
export const font_size = create_size();
export const font_style = create_style();
export const font_weight = create_weight();
export const line_height = create_line_height();