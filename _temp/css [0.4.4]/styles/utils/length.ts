export type Unit = 
'px' | 'mm' | 'cm' | 'in' | 'pc' | 'pt' |
'em' | 'rem' | 'vw' | 'vh' | 'vmin' | 'vmax' |
'%';

export const toREM = 0.25;

export function length (value: number, unit: Unit = 'px')
{
  return value + unit;
}

export function screen_size (name: string)
{
  return `var(--screen-size-${name})`;
}