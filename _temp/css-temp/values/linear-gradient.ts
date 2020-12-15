import { Color } from '../types/color';

type Direction = 'to top left' | 'to top' | 'to top right' | 'to right' | 'to bottom right' | 'to bottom' | 'to bottom left' | 'to left';
type Angle = `${number}deg`;

export function linear_gradient (dir: Direction | Angle, ...values: Color[])
{
  return `linear-gradient(${dir}, ${values.join(', ')})`;
}