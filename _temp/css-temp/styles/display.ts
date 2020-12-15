import { Property } from '../types/property';
import { Global } from '../types/global';

export function display (display: 'flex' | 'grid' | 'block' | Global): Property
{
  return {
    items: [`display: ${display}`],
  }
}