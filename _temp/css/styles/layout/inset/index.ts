import { sizeWithEnums } from '../../utils/size';

const presets = {
  'auto': 'auto',
};

export default {
  x: sizeWithEnums(['inset-x'], ['left', 'right'], presets),
  y: sizeWithEnums(['inset-y'], ['top', 'bottom'], presets),
  xy: sizeWithEnums(['inset'], ['top', 'right', 'bottom', 'left'], presets),
}