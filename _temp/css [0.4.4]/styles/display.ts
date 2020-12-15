import { CSSStyle } from './types/css';
import { global } from './utils/global';

function create ()
{
  const enums = {
    block: 'block',
    flex: 'flex',
    grid: 'grid',
    
    ...global,
  };

  type Enums = typeof enums;
  type Fn = (e: Enums) => string;
  
  return (display: Fn | string): CSSStyle =>
  {
    const a = typeof display === 'function' ? display(enums) : display;
  
    return [`display: ${a}`];
  }
}

export const display = create();