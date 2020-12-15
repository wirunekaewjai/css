import { CSSStyle } from './types/css';
import { global } from './utils/global';
import { system, hex, rgb } from './utils/color';

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
    const a = typeof color === 'function' ? color(enums) : color;
  
    return [`color: ${a}`];
  }
}

export const color = create_color();