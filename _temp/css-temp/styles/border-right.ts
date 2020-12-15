import { Property } from '../types/property';
import { BorderStyle } from '../types/border-style';
import { Color } from '../types/color';
import { Global } from '../types/global';
import { Length } from '../types/length';
import { LengthPercentage } from '../types/length-percentage';

export function border_right (width: Length, style: BorderStyle, color: Color): Property
{
  return {
    items: [`border-right: ${width} ${style} ${color}`],
  }
}

export function border_right_color (color: Color | Global): Property
{
  return {
    items: [`border-right-color: ${color}`],
  }
}

export function border_right_style (style: BorderStyle | Global): Property
{
  return {
    items: [`border-right-style: ${style}`],
  }
}

export function border_right_width (width: Length | Global): Property
{
  return {
    items: [`border-right-width: ${width}`],
  }
}

export function border_right_radius (radius: LengthPercentage | Global): Property
{
  return {
    items: [
      `border-top-right-radius: ${radius}`,
      `border-border-right-radius: ${radius}`,
    ],
  }
}
