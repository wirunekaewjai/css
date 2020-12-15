import { Property } from '../../types/style';
import size from '../utils/size';

const k = 'min-width';
const ns = ['min-width'];
const vp = 'vw';

export default {
  size: size([k], ns),
  screen: (breakpoint: string) => ({
    selector: [[k, 'screen', breakpoint].join('-')],
    props: ns.map(n => `${n}: $size-${breakpoint}`),
  } as Property),

  fit: {
    selector: [[k, 'fit'].join('-')],
    props: ns.map(n => `${n}: 100%`),
  } as Property,

  view: {
    selector: [[k, 'view'].join('-')],
    props: ns.map(n => `${n}: 100${vp}`),
  } as Property,

  min: {
    selector: [[k, 'min'].join('-')],
    props: ns.map(n => [
      `${n}: -webkit-min-content`,
      `${n}: -moz-min-content`,
      `${n}: min-content`,
    ].join('; ')),
  } as Property,

  max: {
    selector: [[k, 'max'].join('-')],
    props: ns.map(n => [
      `${n}: -webkit-max-content`,
      `${n}: -moz-max-content`,
      `${n}: max-content`,
    ].join('; ')),
  } as Property,
};
