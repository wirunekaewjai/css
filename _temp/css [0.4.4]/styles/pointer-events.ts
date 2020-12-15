import { CSSStyle } from './types/css';
import { join } from './utils/array';

function create<T> (enums: T)
{
  type Enums = typeof enums;
  type Fn = (e: Enums) => string;
  
  return (event: Fn | string): CSSStyle =>
  {
    const r = typeof event === 'function' ? event(enums) : event;
    const a = Array.isArray(r) ? join(r, ', ') : r;
  
    return [
      `pointer-events: ${a}`,
    ];
  }
}

export const pointer_events = create({
  none: 'none',
  auto: 'auto',
});