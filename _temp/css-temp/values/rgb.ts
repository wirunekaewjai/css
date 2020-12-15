import { Color } from '../types/color';

export function rgb (r: number, g: number, b: number, opacity: number = 100)
{
  if (opacity === 100)
  {
    const r1 = r.toString(16).padStart(2, '0');
    const g1 = g.toString(16).padStart(2, '0');
    const b1 = b.toString(16).padStart(2, '0');

    return ('#' + r1 + g1 + b1) as Color;
  }

  const a = opacity / 100;
  return `rgba(${r}, ${g}, ${b}, ${a})` as Color;
}