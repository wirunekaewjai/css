import { CSSStyle } from './types/css';

import { join } from './utils/array';
import { global } from './utils/global';

function create<T> (name: string, enums: T)
{
  type Enums = typeof enums;
  type Fn = (e: Enums) => string;
  
  return (justify: Fn | string): CSSStyle =>
  {
    const r = typeof justify === 'string' ? justify : justify(enums);
    const a = Array.isArray(r) ? join(r, ', ') : r;
  
    return [`${name}: ${a}`];
  }
}

export const justify_content = create('justify-content', {
  center: 'center',
  start: 'flex-start',
  end: 'flex-end',
  between: 'space-between',
  around: 'space-around',
  evenly: 'space-evenly',

  ...global,
});

export const justify_items = create('justify-items', {
  center: 'center',
  start: 'start',
  end: 'end',
  auto: 'auto',
  stretch: 'stretch',

  ...global,
});

export const justify_self = create('justify-self', {
  center: 'center',
  start: 'start',
  end: 'end',
  auto: 'auto',
  stretch: 'stretch',

  ...global,
});