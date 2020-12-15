import { CSSStyle } from './types/css';
import { toREM } from './utils/length';

const child = ' > * + *';

function calc (v: string | number)
{
  if (typeof v === 'number')
  {
    return (v * toREM) + 'rem';
  }

  return v;
}

export function space_between_x (space: string | number): CSSStyle
{
  return {
    [child]: [`margin-left: ${calc(space)}`],
  };
}

export function space_between_y (space: string | number): CSSStyle
{
  return {
    [child]: [`margin-top: ${calc(space)}`],
  };
}