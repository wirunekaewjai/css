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

export const text_align = create('text-align', {
  left: 'left',
  right: 'right',
  center: 'center',
  justify: 'justify',
  
  ...global,
});