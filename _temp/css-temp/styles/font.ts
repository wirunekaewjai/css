import { Property } from '../types/property';
import { Global } from '../types/global';
import { LengthPercentage } from '../types/length-percentage';

export function font_family (...family: (string | Global)[]): Property
{
  const f = family.filter(e => !!e).join(', ');

  return {
    items: [`font-family: ${f}`],
  }
}

export function font_size (size: LengthPercentage | Global): Property
{
  return {
    items: [`font-size: ${size}`],
  }
}

export function font_style (style: 'normal' | 'italic' | Global): Property
{
  return {
    items: [`font-style: ${style}`],
  }
}

export function font_weight (weight: 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 | Global): Property
{
  return {
    items: [`font-weight: ${weight}`],
  }
}

export function line_height (height: number | LengthPercentage | 'normal' | Global): Property
{
  return {
    items: [`line-height: ${height}`],
  }
}