import { Property } from '../../../types/style';

export default {
  none: {
    selector: ['outline-none'],
    props: [
      'outline: 2px solid transparent',
      'outline-offset: 2px',
    ],
  } as Property,

  white: {
    selector: ['outline-white'],
    props: [
      'outline: 2px dotted white',
      'outline-offset: 2px',
    ],
    v: '2px ; outline-offset: 2px',
  } as Property,

  black: {
    selector: ['outline-black'],
    props: [
      'outline: 2px dotted black',
      'outline-offset: 2px',
    ],
  } as Property,
}