import { Property } from '../types/property';
import { BorderStyle } from '../types/border-style';
import { Color } from '../types/color';
import { Length } from '../types/length';

export function divide_color (color: Color): Property
{
  return {
    child: '> * + *',
    items: [`border-color: ${color}`],
  }
}

export function divide_style (style: BorderStyle): Property
{
  return {
    child: '> * + *',
    items: [`border-style: ${style}`],
  }
}

export function divide_x (width: Length): Property
{
  return {
    child: '> * + *',
    items: [`border-left-width: ${width}`],
  }
}

export function divide_y (width: Length): Property
{
  return {
    child: '> * + *',
    items: [`border-top-width: ${width}`],
  }
}

export function divide_reverse_x (width: Length): Property
{
  return {
    child: '> * + *',
    items: [`border-right-width: ${width}`],
  }
}

export function divide_reverse_y (width: Length): Property
{
  return {
    child: '> * + *',
    items: [`border-bottom-width: ${width}`],
  }
}