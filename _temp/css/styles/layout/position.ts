import { Property } from '../../types/style';

export default {
  static: {
    selector: ['position-static'],
    props: ['position: static'],
  } as Property,

  fixed: {
    selector: ['position-fixed'],
    props: ['position: fixed'],
  } as Property,

  absolute: {
    selector: ['position-absolute'],
    props: ['position: absolute'],
  } as Property,

  relative: {
    selector: ['position-relative'],
    props: ['position: relative'],
  } as Property,

  sticky: {
    selector: ['position-sticky'],
    props: ['position: sticky'],
  } as Property,
}