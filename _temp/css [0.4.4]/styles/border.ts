
import {
  create_border,
  create_border_color,
  create_border_style,
  create_border_width,
  create_border_radius,
} from './utils/border';

export const border = create_border('border');
export const border_color = create_border_color<string | string[]>('border-color');
export const border_style = create_border_style<string | string[]>('border-style');
export const border_width = create_border_width<number | string | string[]>('border-width');
export const border_radius = create_border_radius<number | string | string[]>(['border-top-left-radius', 'border-top-right-radius', 'border-bottom-right-radius', 'border-bottom-left-radius']);