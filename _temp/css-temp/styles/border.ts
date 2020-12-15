import { Property } from '../types/property';
import { BorderStyle } from '../types/border-style';
import { Color } from '../types/color';
import { Global } from '../types/global';
import { Length } from '../types/length';
import { LengthPercentage } from '../types/length-percentage';

export function border (width: Length, style: BorderStyle, color: Color): Property
{
  return {
    items: [`border: ${width} ${style} ${color}`],
  }
}

export function border_color (...color: [string | Global, string?, string?, string?]): Property
{
  const s = color.filter(e => !!e).join(' ');

  return {
    items: [`border-color: ${s}`],
  }
}

export function border_style (...style: [BorderStyle | Global, BorderStyle?, BorderStyle?, BorderStyle?]): Property
{
  const s = style.filter(e => !!e).join(' ');

  return {
    items: [`border-style: ${s}`],
  }
}

export function border_width (...width: [Length | Global, Length?, Length?, Length?]): Property
{
  const s = width.filter(e => !!e).join(' ');

  return {
    items: [`border-width: ${s}`],
  }
}

export function border_radius (...radius: [LengthPercentage | Global, LengthPercentage?, LengthPercentage?, LengthPercentage?]): Property
{
  const s = radius.filter(e => !!e).join(' ');

  return {
    items: [`border-radius: ${s}`],
  }
}