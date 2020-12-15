import { Property } from '../types/property';
import { BorderStyle } from '../types/border-style';
import { Color } from '../types/color';
import { Global } from '../types/global';
import { Length } from '../types/length';
import { LengthPercentage } from '../types/length-percentage';

export function border_left (width: Length, style: BorderStyle, color: Color): Property
{
  return {
    items: [`border-left: ${width} ${style} ${color}`],
  }
}

export function border_left_color (color: Color | Global): Property
{
  return {
    items: [`border-left-color: ${color}`],
  }
}

export function border_left_style (style: BorderStyle | Global): Property
{
  return {
    items: [`border-left-style: ${style}`],
  }
}

export function border_left_width (width: Length | Global): Property
{
  return {
    items: [`border-left-width: ${width}`],
  }
}

export function border_left_radius (radius: LengthPercentage | Global): Property
{
  return {
    items: [
      `border-top-left-radius: ${radius}`,
      `border-border-left-radius: ${radius}`,
    ],
  }
}
