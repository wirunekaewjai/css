import { Property } from '../../types/style';

export default {
  none: {
    selector: ['bg-no-repeat'],
    props: ['background-repeat: no-repeat'],
  } as Property,

  xy: {
    selector: ['bg-repeat'],
    props: ['background-repeat: repeat'],
  } as Property,

  x: {
    selector: ['bg-repeat-x'],
    props: ['background-repeat: repeat-x'],
  } as Property,

  y: {
    selector: ['bg-repeat-y'],
    props: ['background-repeat: repeat-y'],
  } as Property,

  round: {
    selector: ['bg-repeat-round'],
    props: ['background-repeat: round'],
  } as Property,

  space: {
    selector: ['bg-repeat-space'],
    props: ['background-repeat: space'],
  } as Property,
};