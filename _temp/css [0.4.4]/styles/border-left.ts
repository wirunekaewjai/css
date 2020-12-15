
import {
  create_border,
  create_border_color,
  create_border_style,
  create_border_width,
  create_border_radius,
} from './utils/border';

export const border_left = create_border('border-left');
export const border_left_color = create_border_color<string>('border-left-color');
export const border_left_style = create_border_style<string>('border-left-style');
export const border_left_width = create_border_width<number | string>('border-left-width');
export const border_left_radius = create_border_radius<number | string>(['border-top-left-radius', 'border-bottom-left-radius']);