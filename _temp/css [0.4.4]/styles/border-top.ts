
import {
  create_border,
  create_border_color,
  create_border_style,
  create_border_width,
  create_border_radius,
} from './utils/border';

export const border_top = create_border('border-top');
export const border_top_color = create_border_color<string>('border-top-color');
export const border_top_style = create_border_style<string>('border-top-style');
export const border_top_width = create_border_width<number | string>('border-top-width');
export const border_top_radius = create_border_radius<number | string>(['border-top-left-radius', 'border-top-right-radius']);
export const border_top_left_radius = create_border_radius<number | string>(['border-top-left-radius']);
export const border_top_right_radius = create_border_radius<number | string>(['border-top-right-radius']);