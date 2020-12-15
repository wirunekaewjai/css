import { Property } from '../../../types/style';

export default {
  none: {
    selector: ['pointer-events-none'],
    props: ['pointer-events: none'],
  } as Property,

  auto: {
    selector: ['pointer-events-auto'],
    props: ['pointer-events: auto'],
  } as Property,
}