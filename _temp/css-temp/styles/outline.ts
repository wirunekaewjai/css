import { Property } from '../types/property';
import { BorderStyle } from '../types/border-style';
import { Color } from '../types/color';
import { Global } from '../types/global';
import { Length } from '../types/length';

export function outline (color: Color, style: BorderStyle, width: Length): Property
{
  return {
    items: [`outline: ${color} ${style} ${width}`],
  }
}

export function outline_color (color: Color | Global): Property
{
  return {
    items: [`outline-color: ${color}`],
  }
}

export function outline_style (style: BorderStyle | Global): Property
{
  return {
    items: [`outline-style: ${style}`],
  }
}

export function outline_width (width: Length | Global): Property
{
  return {
    items: [`outline-width: ${width}`],
  }
}

export function outline_offset (offset: Length | Global): Property
{
  return {
    items: [`outline-offset: ${offset}`],
  }
}
