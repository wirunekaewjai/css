import { Property } from '../types/property';
import { BorderStyle } from '../types/border-style';
import { Color } from '../types/color';
import { Global } from '../types/global';
import { Length } from '../types/length';
import { LengthPercentage } from '../types/length-percentage';

export function border_bottom (width: Length, style: BorderStyle, color: Color): Property
{
  return {
    items: [`border-bottom: ${width} ${style} ${color}`],
  }
}

export function border_bottom_color (color: Color | Global): Property
{
  return {
    items: [`border-bottom-color: ${color}`],
  }
}

export function border_bottom_style (style: BorderStyle | Global): Property
{
  return {
    items: [`border-bottom-style: ${style}`],
  }
}

export function border_bottom_width (width: Length | Global): Property
{
  return {
    items: [`border-bottom-width: ${width}`],
  }
}

export function border_bottom_radius (radius: LengthPercentage | Global): Property
{
  return {
    items: [
      `border-bottom-left-radius: ${radius}`,
      `border-bottom-right-radius: ${radius}`,
    ],
  }
}

export function border_bottom_left_radius (radius: LengthPercentage | Global): Property
{
  return {
    items: [
      `border-bottom-left-radius: ${radius}`,
    ],
  }
}

export function border_bottom_right_radius (radius: LengthPercentage | Global): Property
{
  return {
    items: [
      `border-bottom-right-radius: ${radius}`,
    ],
  }
}