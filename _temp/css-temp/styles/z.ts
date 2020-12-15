import { Property } from '../types/property';
import { Global } from '../types/global';

export function z (index: number | Global): Property
{
  return {
    items: [`z-index: ${index}`],
  }
}