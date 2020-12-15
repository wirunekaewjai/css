import { Property } from '../types/property';
import { Global } from '../types/global';
import { LengthPercentage } from '../types/length-percentage';

export function position (position: 'static' | 'fixed' | 'absolute' | 'relative' | 'sticky'): Property
{
  if (['sticky'].includes(position))
  {
    return {
      items: [
        `position: -webkit-${position}`,
        `position: ${position}`,
      ],
    };
  }

  return {
    items: [`position: ${position}`],
  };
}

export function inset (inset: LengthPercentage | 'auto' | Global): Property
{
  return {
    items: [
      `top: ${inset}`,
      `right: ${inset}`,
      `bottom: ${inset}`,
      `left: ${inset}`,
    ],
  }
}

export function inset_x (x: LengthPercentage | 'auto' | Global): Property
{
  return {
    items: [
      `right: ${x}`,
      `left: ${x}`,
    ],
  }
}

export function inset_y (y: LengthPercentage | 'auto' | Global): Property
{
  return {
    items: [
      `top: ${y}`,
      `bottom: ${y}`,
    ],
  }
}

export function top (top: LengthPercentage | 'auto' | Global): Property
{
  return {
    items: [`top: ${top}`],
  }  
}

export function right (right: LengthPercentage | 'auto' | Global): Property
{
  return {
    items: [`right: ${right}`],
  }
}

export function bottom (bottom: LengthPercentage | 'auto' | Global): Property
{
  return {
    items: [`bottom: ${bottom}`],
  }
}

export function left (left: LengthPercentage | 'auto' | Global): Property
{
  return {
    items: [`left: ${left}`],
  }
}