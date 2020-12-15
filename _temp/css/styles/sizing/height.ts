import { Property } from '../../types/style';
import size from '../utils/size';

const k = 'height';
const ns = ['height'];
const vp = 'vh';

export default {
  size: size([k], ns),
  screen: (breakpoint: string) => ({
    selector: [[k, 'screen', breakpoint].join('-')],
    props: ns.map(n => `${n}: $size-${breakpoint}`),
  } as Property),

  auto: {
    selector: [[k, 'auto'].join('-')],
    props: ns.map(n => `${n}: auto`),
  } as Property,

  fit: {
    selector: [[k, 'fit'].join('-')],
    props: ns.map(n => `${n}: 100%`),
  } as Property,

  view: {
    selector: [[k, 'view'].join('-')],
    props: ns.map(n => `${n}: 100${vp}`),
  } as Property,
};
