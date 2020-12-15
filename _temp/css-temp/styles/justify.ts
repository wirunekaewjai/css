import { Property } from '../types/property';
import { Global } from '../types/global';

export function justify_content (justify: 'center' | 'flex-start' | 'flex-end' | 'space-between' | 'space-around' | 'space-evenly' | Global): Property
{
  return {
    items: [`justify-content: ${justify}`],
  }
}

export function justify_items (justify: 'center' | 'start' | 'end' | 'auto' | 'stretch' | Global): Property
{
  return {
    items: [`justify-items: ${justify}`],
  }
}

export function justify_self (justify: 'center' | 'start' | 'end' | 'auto' | 'stretch' | Global): Property
{
  return {
    items: [`justify-self: ${justify}`],
  }
}