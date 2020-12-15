
import {
  create_border,
  create_border_color,
  create_border_style,
  create_border_width,
  create_border_radius,
} from './utils/border';

export const border_right = create_border('border-right');
export const border_right_color = create_border_color<string>('border-right-color');
export const border_right_style = create_border_style<string>('border-right-style');
export const border_right_width = create_border_width<number | string>('border-right-width');
export const border_right_radius = create_border_radius<number | string>(['border-top-right-radius', 'border-bottom-right-radius']);