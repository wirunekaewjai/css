import { Property } from '../types/property';
import { Color } from '../types/color';
import { Global } from '../types/global';

export function color (color: Color | Global): Property
{
  return {
    items: [`color: ${color}`],
  }
}