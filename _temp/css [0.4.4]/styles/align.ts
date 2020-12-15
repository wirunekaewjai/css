import { CSSStyle } from './types/css';
import { join } from './utils/array';
import { global } from './utils/global';

function create<T> (name: string, enums: T)
{
  type Enums = typeof enums;
  type Fn = (e: Enums) => string;
  
  return (align: Fn | string): CSSStyle =>
  {
    const r = typeof align === 'function' ? align(enums) : align;
    const a = Array.isArray(r) ? join(r, ', ') : r;
  
    return [`${name}: ${a}`];
  }
}

export const align_content = create('align-content', {
  center: 'center',
  start: 'flex-start',
  end: 'flex-end',
  between: 'space-between',
  around: 'space-around',
  evenly: 'space-evenly',

  ...global,
});

export const align_items = create('align-items', {
  center: 'center',
  start: 'flex-start',
  end: 'flex-end',
  baseline: 'baseline',
  stretch: 'stretch',

  ...global,
});

export const align_self = create('align-self', {
  center: 'center',
  start: 'flex-start',
  end: 'flex-end',
  baseline: 'baseline',
  stretch: 'stretch',

  ...global,
});