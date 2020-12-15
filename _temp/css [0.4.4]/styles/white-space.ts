import { CSSStyle } from './types/css';

function create<T> (enums: T)
{
  type Enums = typeof enums;
  type Fn = (e: Enums) => string;
  
  return (type: Fn | string): CSSStyle =>
  {
    const a = typeof type === 'function' ? type(enums) : type;
  
    return [
      `white-space: ${a}`,
    ];
  }
}

export const white_space = create({
  normal: 'normal',
  nowrap: 'nowrap',
  pre: 'pre',
  pre_line: 'pre-line',
  pre_wrap: 'pre-wrap',
});