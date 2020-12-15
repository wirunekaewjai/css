import { Property } from '../types/property';
import { Global } from '../types/global';
import { LengthPercentage } from '../types/length-percentage';

type Value = LengthPercentage;
export function padding (...padding: [Value | Global, Value?, Value?, Value?]): Property
{
  const m = padding.filter(e => !!e).join(' ');
  
  return {
    items: [`padding: ${m}`],
  }
}

export function padding_x (padding: Value | Global): Property
{
  return {
    items: [
      `padding-left: ${padding}`,
      `padding-right: ${padding}`,
    ],
  }
}

export function padding_y (padding: Value | Global): Property
{
  return {
    items: [
      `padding-top: ${padding}`,
      `padding-bottom: ${padding}`,
    ],
  }
}

export function padding_top (padding: Value | Global): Property
{
  return {
    items: [
      `padding-top: ${padding}`,
    ],
  }
}

export function padding_right (padding: Value | Global): Property
{
  return {
    items: [
      `padding-right: ${padding}`,
    ],
  }
}

export function padding_bottom (padding: Value | Global): Property
{
  return {
    items: [
      `padding-bottom: ${padding}`,
    ],
  }
}

export function padding_left (padding: Value | Global): Property
{
  return {
    items: [
      `padding-left: ${padding}`,
    ],
  }
}