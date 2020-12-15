import { Property } from '../types/property';
import { Global } from '../types/global';
import { LengthPercentage } from '../types/length-percentage';

type ScreenSize = `var(--screen-size-${string})`;

const fixeds = ['min-content', 'max-content'];

function fix (key: string, value: string)
{
  if (fixeds.includes(value))
  {
    return [
      `${key}: -webkit-${value}`,
      `${key}: -moz-${value}`,
      `${key}: ${value}`,
    ];
  }

  return [ `${key}: ${value}` ];
}

export function height (height: LengthPercentage | 'auto' | Global): Property
{
  return {
    items: fix('height', height),
  }
}

export function min_height (height: LengthPercentage | Global): Property
{
  return {
    items: fix('min-height', height),
  }
}

export function max_height (height: LengthPercentage | 'auto' | 'min-content' | 'max-content' | Global): Property
{
  return {
    items: fix('max-height', height),
  };
}

export function width (width: LengthPercentage | ScreenSize | 'auto' | 'min-content' | 'max-content' | Global): Property
{
  return {
    items: fix('width', width),
  };
}

export function min_width (width: LengthPercentage | ScreenSize | 'auto' | 'min-content' | 'max-content' | Global): Property
{
  return {
    items: fix('min-width', width),
  };
}

export function max_width (width: LengthPercentage | ScreenSize | 'none' | 'min-content' | 'max-content' | Global): Property
{
  return {
    items: fix('max-width', width),
  };
}