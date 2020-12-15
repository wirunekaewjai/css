import { Property } from '../types/property';
import { Global } from '../types/global';

const fixeds = ['grab', 'grabbing'];
export function cursor (cursor: 'auto' | 'default' | 'pointer' | 'grab' | 'grabbing' | 'wait' | 'text' | 'move' | 'not-allowed' | Global): Property
{
  if (fixeds.includes(cursor))
  {
    return {
      items: [
        `cursor: -webkit-${cursor}`,
        `cursor: ${cursor}`,
      ],
    };
  }

  return {
    items: [`cursor: ${cursor}`],
  };
}