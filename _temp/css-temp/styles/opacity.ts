import { Property } from '../types/property';

export function opacity (v: number): Property
{
  return {
    items: [`opacity: ${v}`],
  }
}