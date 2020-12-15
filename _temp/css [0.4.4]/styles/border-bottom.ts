
import {
  create_border,
  create_border_color,
  create_border_style,
  create_border_width,
  create_border_radius,
} from './utils/border';

export const border_bottom = create_border('border-bottom');
export const border_bottom_color = create_border_color<string>('border-bottom-color');
export const border_bottom_style = create_border_style<string>('border-bottom-style');
export const border_bottom_width = create_border_width<number | string>('border-bottom-width');
export const border_bottom_radius = create_border_radius<number | string>(['border-bottom-left-radius', 'border-bottom-right-radius']);
export const border_bottom_left_radius = create_border_radius<number | string>(['border-bottom-left-radius']);
export const border_bottom_right_radius = create_border_radius<number | string>(['border-bottom-right-radius']);