import { Property } from '../types/property';

export function flex_direction (direction: 'row' | 'row-reverse' | 'column' | 'column-reverse'): Property
{
  return {
    items: [`flex-direction: ${direction}`],
  }
}

export function flex_wrap (wrap: 'wrap' | 'nowrap' | 'wrap-reverse'): Property
{
  return {
    items: [`flex-wrap: ${wrap}`],
  }
}

export function flex_grow (grow: 0 | 1): Property
{
  return {
    items: [`flex-grow: ${grow}`],
  }
}

export function flex_shrink (shrink: 0 | 1): Property
{
  return {
    items: [`flex-shrink: ${shrink}`],
  }
}
