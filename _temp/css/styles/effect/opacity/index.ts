import { Property } from '../../../types/style';
import { Opacity } from '../../../types/color';

export default (v: Opacity) => ({
  selector: ['opacity-' + v],
  props: [`opacity: ${v / 100}`],
} as Property);