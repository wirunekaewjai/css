import { Property } from '../../../types/style';

export default {
  none: {
    selector: ['shadow-none'],
    props: ['box-shadow: 0 0 transparent'],
  } as Property,

  xs: {
    selector: ['shadow-xs'],
    props: ['box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05)'],
  } as Property,

  sm: {
    selector: ['shadow-sm'],
    props: ['box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)'],
  } as Property,

  md: {
    selector: ['shadow-md'],
    props: ['box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'],
  } as Property,

  lg: {
    selector: ['shadow-lg'],
    props: ['box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'],
  } as Property,

  xl: {
    selector: ['shadow-xl'],
    props: ['box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'],
  } as Property,

  '2xl': {
    selector: ['shadow-2xl'],
    props: ['box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25)'],
  } as Property,
}