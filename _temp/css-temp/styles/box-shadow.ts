import { Property } from '../types/property';

export function box_shadow (...shadow: string[]): Property
{
  const s = shadow.filter(e => !!e).join(', ');

  return {
    items: [`box-shadow: ${s}`],
  }
}