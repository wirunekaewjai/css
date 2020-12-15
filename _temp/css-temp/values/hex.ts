import { Color } from '../types/color';

export function hex (hex: string, opacity: number = 100)
{
  let h = hex.startsWith('#') ? hex.slice(1) : hex;

  if (opacity === 100)
  {
    return ('#' + h) as Color;
  }

  // rrggbb
  const r = parseInt(h.charAt(0) + h.charAt(1), 16);
  const g = parseInt(h.charAt(2) + h.charAt(3), 16);
  const b = parseInt(h.charAt(4) + h.charAt(5), 16);
  const a = opacity / 100;

  return `rgba(${r}, ${g}, ${b}, ${a})` as Color;
}