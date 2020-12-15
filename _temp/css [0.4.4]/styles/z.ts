import { CSSStyle } from './types/css';
import { global } from './utils/global';

function create_z ()
{
  const enums = global;
  
  type Enums = typeof enums;
  type Fn = (e: Enums) => string;

  function getValue (v: number | string)
  {
    if (typeof v === 'string')
    {
      return v;
    }

    return Math.floor(v);
  }

  return (index: Fn | number | string): CSSStyle =>
  {
    const a = typeof index === 'function' ? index(enums) : index;

    return [
      `z-index: ${getValue(a)}`,
    ];
  };
}

export const z = create_z();