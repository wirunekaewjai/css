import { Property } from '../types/property';
import { BorderStyle } from '../types/border-style';
import { Color } from '../types/color';
import { Global } from '../types/global';
import { Length } from '../types/length';
import { LengthPercentage } from '../types/length-percentage';

export function border_top (width: Length, style: BorderStyle, color: Color): Property
{
  return {
    items: [`border-top: ${width} ${style} ${color}`],
  }
}

export function border_top_color (color: Color | Global): Property
{
  return {
    items: [`border-top-color: ${color}`],
  }
}

export function border_top_style (style: BorderStyle | Global): Property
{
  return {
    items: [`border-top-style: ${style}`],
  }
}

export function border_top_width (width: Length | Global): Property
{
  return {
    items: [`border-top-width: ${width}`],
  }
}

export function border_top_radius (radius: LengthPercentage | Global): Property
{
  return {
    items: [
      `border-top-left-radius: ${radius}`,
      `border-top-right-radius: ${radius}`,
    ],
  }
}

export function border_top_left_radius (radius: LengthPercentage | Global): Property
{
  return {
    items: [
      `border-top-left-radius: ${radius}`,
    ],
  }
}

export function border_top_right_radius (radius: LengthPercentage | Global): Property
{
  return {
    items: [
      `border-top-right-radius: ${radius}`,
    ],
  }
}