import { Property } from '../../types/style';

type Value = 0 | 10 | 20 | 30 | 40 | 50 | 'auto';

export default (v: Value) => ({
  selector: ['z-index-' + v],
  props: [`z-index: ${v}`],
} as Property);