import { CSSStyle } from './types/css';
import { global } from './utils/global';

function create ()
{
  const enums = {
    auto: 'auto',
    default: 'default',
    pointer: 'pointer',
    wait: 'wait',
    text: 'text',
    move: 'move',
    not_allowed: 'not-allowed',

    grab: [
      '-webkit-grab',
      'grab',
    ],

    grabbing: [
      '-webkit-grabbing',
      'grabbing',
    ],

    ...global,
  };

  type Enums = typeof enums;
  type Fn = (e: Enums) => string | string[];
  
  return (cursor: Fn | string | string[]): CSSStyle =>
  {
    const a = typeof cursor === 'function' ? cursor(enums) : cursor;
  
    if (Array.isArray(a))
    {
      return [
        a.map(e => `cursor: ${e}`),
      ];
    }

    return [`cursor: ${a}`];
  }
}

export const cursor = create();