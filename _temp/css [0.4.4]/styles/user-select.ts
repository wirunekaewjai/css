import { CSSStyle } from './types/css';

function create<T> (enums: T)
{
  type Enums = typeof enums;
  type Fn = (e: Enums) => string;
  
  return (select: Fn | string): CSSStyle =>
  {
    const a = typeof select === 'function' ? select(enums) : select;
  
    return [
      [
        `-webkit-user-select: ${a}`,
        `-moz-user-select: ${a}`,
        `user-select: ${a}`,
      ]
    ];
  }
}

export const user_select = create({
  none: 'none',
  auto: 'auto',
  text: 'text',
  all: 'all',
});