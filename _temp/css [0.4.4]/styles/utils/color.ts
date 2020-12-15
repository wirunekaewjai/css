
export const system = {
  currentColor: 'currentColor',
  transparent: 'transparent',
};

export function hex (hex: string, opacity: number = 100)
{
  let h = hex.startsWith('#') ? hex.slice(1) : hex;

  if (opacity === 100)
  {
    return ('#' + h);
  }

  // rrggbb
  const r = parseInt(h.charAt(0) + h.charAt(1), 16);
  const g = parseInt(h.charAt(2) + h.charAt(3), 16);
  const b = parseInt(h.charAt(4) + h.charAt(5), 16);
  const a = opacity / 100;

  return `rgba(${r}, ${g}, ${b}, ${a})`;
}

export function rgb (r: number, g: number, b: number, opacity: number = 100)
{
  if (opacity === 100)
  {
    const r1 = r.toString(16).padStart(2, '0');
    const g1 = g.toString(16).padStart(2, '0');
    const b1 = b.toString(16).padStart(2, '0');

    return ('#' + r1 + g1 + b1);
  }

  const a = opacity / 100;
  return `rgba(${r}, ${g}, ${b}, ${a})`;
}