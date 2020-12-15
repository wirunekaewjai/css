import { Property } from '../types/property';
import { Global } from '../types/global';
import { LengthPercentage } from '../types/length-percentage';

type Value = LengthPercentage | 'auto';
export function margin (...margin: [Value | Global, Value?, Value?, Value?]): Property
{
  const m = margin.filter(e => !!e).join(' ');
  
  return {
    items: [`margin: ${m}`],
  }
}

export function margin_x (margin: Value | Global): Property
{
  return {
    items: [
      `margin-left: ${margin}`,
      `margin-right: ${margin}`,
    ],
  }
}

export function margin_y (margin: Value | Global): Property
{
  return {
    items: [
      `margin-top: ${margin}`,
      `margin-bottom: ${margin}`,
    ],
  }
}

export function margin_top (margin: Value | Global): Property
{
  return {
    items: [
      `margin-top: ${margin}`,
    ],
  }
}

export function margin_right (margin: Value | Global): Property
{
  return {
    items: [
      `margin-right: ${margin}`,
    ],
  }
}

export function margin_bottom (margin: Value | Global): Property
{
  return {
    items: [
      `margin-bottom: ${margin}`,
    ],
  }
}

export function margin_left (margin: Value | Global): Property
{
  return {
    items: [
      `margin-left: ${margin}`,
    ],
  }
}