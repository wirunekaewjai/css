import { CSSStyle } from './types/css';
import { join } from './utils/array';

function create<T> (enums: T)
{
  type Enums = typeof enums;
  type Fn = (e: Enums) => string;
  
  return (appearance: Fn | string): CSSStyle =>
  {
    const r = typeof appearance === 'function' ? appearance(enums) : appearance;
    const a = Array.isArray(r) ? join(r, ', ') : r;
  
    return [
      [
        `-webkit-appearance: ${a}`,
        `-moz-appearance: ${a}`,
        `appearance: ${a}`,
      ]
    ];
  }
}

export const appearance = create({
  none: 'none',
});