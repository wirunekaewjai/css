import { Property } from '../types/property';
import { Global } from '../types/global';

export function align_content (align: 'center' | 'flex-start' | 'flex-end' | 'space-between' | 'space-around' | 'space-evenly' | Global): Property
{
  return {
    items: [`align-content: ${align}`],
  }
}

export function align_items (align: 'center' | 'flex-start' | 'flex-end' | 'baseline' | 'stretch' | Global): Property
{
  return {
    items: [`align-items: ${align}`],
  }
}

export function align_self (align: 'center' | 'flex-start' | 'flex-end' | 'baseline' | 'stretch' | Global): Property
{
  return {
    items: [`align-self: ${align}`],
  }
}