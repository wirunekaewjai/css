import { Property } from '../../../types/style';

export default {
  none: {
    selector: ['appearance-none'],
    props: [
      '-webkit-appearance: none',
      '-moz-appearance: none',
      'appearance: none',
    ],
  } as Property,
}