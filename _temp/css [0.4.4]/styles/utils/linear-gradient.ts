import { join } from './array';
import { system, hex, rgb } from './color';

type Direction = 'to top left' | 'to top' | 'to top right' | 'to right' | 'to bottom right' | 'to bottom' | 'to bottom left' | 'to left';

function create_linear_gradient (dir: Direction)
{
  const enums = {
    hex,
    rgb,

    ...system,
  };

  type Enums = typeof enums;
  type Fn = (e: Enums) => string[];

  return (args: Fn | string[]) =>
  {
    const r = typeof args === 'function' ? args(enums) : args;
    const a = Array.isArray(r) ? join(r, ', ') : r;

    return `linear-gradient(${dir}, ${a})`;
  }
}

function create_linear_gradient_from_angle ()
{
  const enums = {
    hex,
    rgb,

    ...system,
  };

  type Enums = typeof enums;
  type Fn = (e: Enums) => string[];

  return (angle: number, colors: Fn | string[]) =>
  {
    const r = typeof colors === 'function' ? colors(enums) : colors;
    const a = Array.isArray(r) ? join(r, ', ') : r;

    return `linear-gradient(${angle}deg, ${a})`;
  }
}

export const angle = create_linear_gradient_from_angle();
export const to_top_left = create_linear_gradient('to top left');
export const to_top = create_linear_gradient('to top');
export const to_top_right = create_linear_gradient('to top right');
export const to_right = create_linear_gradient('to right');
export const to_bottom_right = create_linear_gradient('to bottom right');
export const to_bottom = create_linear_gradient('to bottom');
export const to_bottom_left = create_linear_gradient('to bottom left');
export const to_left = create_linear_gradient('to left');