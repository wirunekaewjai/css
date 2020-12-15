import { CSSStyle } from './types/css';
import { global } from './utils/global';
import { join } from './utils/array';
import { system, hex, rgb } from './utils/color';
import { url, urls } from './utils/url';

import * as linear from './utils/linear-gradient';

function create_background_attachment ()
{
  const enums = {
    fixed: 'fixed',
    local:  'local',
    scroll: 'scroll',

    ...global,
  };

  type Enums = typeof enums;
  type Fn = (e: Enums) => string | string[];
  
  return (attachment: Fn | string): CSSStyle =>
  {
    const r = typeof attachment === 'function' ? attachment(enums) : attachment;
    const a = Array.isArray(r) ? join(r, ', ') : r;
  
    return [`background-attachment: ${a}`];
  }
}

function create_background_color ()
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
    const a = typeof color === 'function' ? color(enums) : color;
  
    return [`background-color: ${a}`];
  }
}

function create_background_image ()
{
  const enums = {
    linear,
    url,
    urls,
  };

  type Enums = typeof enums;
  type V = string | string[];
  type Fn = (e: Enums) => string | string[];

  function getValues (value: V)
  {
    if (Array.isArray(value))
    {
      return value;
    }

    return [value];
  }
  
  return (image: Fn | V): CSSStyle =>
  {
    const r = typeof image === 'function' ? getValues(image(enums)) : getValues(image);
    const a = Array.isArray(r) ? join(r, ', ') : r;
  
    return [`background-image: ${a}`];
  }
}

function create_background_position ()
{
  const enums = {
    top_left: 'top left',
    top: 'top',
    top_right: 'top right',

    right: 'right',

    bottom_right: 'bottom right',
    bottom: 'bottom',
    bottom_left: 'bottom left',

    left: 'left',

    center: 'center',

    ...global,
  };

  type P = {
    top?: string,
    right?: string,
    bottom?: string,
    left?: string
  };

  type Enums = typeof enums;
  type V = string | P | (string | P)[];
  type Fn = (e: Enums) => V;

  function getP (src: P, key: keyof P)
  {
    if (src[key])
    {
      return `${key} ${src[key]}`;
    }
  }

  function getValue (value: string | P)
  {
    if (typeof value === 'string')
    {
      return value;
    }
    
    const v1 = getP(value, 'top') ?? getP(value, 'bottom');
    const v2 = getP(value, 'right') ?? getP(value, 'left');

    return join([v1, v2], ' ');
  }

  function getValues (value: V)
  {
    if (Array.isArray(value))
    {
      return value.map(e => getValue(e));
    }

    return [getValue(value)];
  }
  
  return (position: Fn | V): CSSStyle =>
  {
    const r = typeof position === 'function' ? getValues(position(enums)) : getValues(position);
    const a = Array.isArray(r) ? join(r, ', ') : r;
  
    return [`background-position: ${a}`];
  }
}

function create_background_repeat ()
{
  const enums = {
    no_repeat: 'no-repeat',
    repeat: 'repeat',
    repeat_x: 'repeat-x',
    repeat_y: 'repeat-y',
    round: 'round',
    space: 'space',

    ...global,
  };

  type Enums = typeof enums;
  type V = string | string[];
  type Fn = (e: Enums) => V;

  function getValues (value: V)
  {
    if (Array.isArray(value))
    {
      return value;
    }

    return [value];
  }
  
  return (repeat: Fn | V): CSSStyle =>
  {
    const r = typeof repeat === 'function' ? getValues(repeat(enums)) : getValues(repeat);
    const a = Array.isArray(r) ? join(r, ', ') : r;
  
    return [`background-repeat: ${a}`];
  }
}

function create_background_size ()
{
  const enums = {
    auto: 'auto',
    cover: 'cover',
    contain: 'contain',

    ...global,
  };

  type S = {
    width?: string,
    height?: string,
  };

  type Enums = typeof enums;
  type V = string | S | (string | S)[];
  type Fn = (e: Enums) => V;

  function getValue (value: string | S)
  {
    if (typeof value === 'string')
    {
      return value;
    }

    return join([value.width ?? 'auto', value.height], ' ');
  }

  function getValues (value: V)
  {
    if (Array.isArray(value))
    {
      return value.map(e => getValue(e));
    }

    return [getValue(value)];
  }
  
  return (size: Fn | V): CSSStyle =>
  {
    const r = typeof size === 'function' ? getValues(size(enums)) : getValues(size);
    const a = Array.isArray(r) ? join(r, ', ') : r;
  
    return [`background-size: ${a}`];
  }
}

export const background_attachment = create_background_attachment();
export const background_color = create_background_color();
export const background_image = create_background_image();
export const background_position = create_background_position();
export const background_repeat = create_background_repeat();
export const background_size = create_background_size();