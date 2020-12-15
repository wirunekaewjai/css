import { Property } from '../../../types/style';

export default {
  auto: {
    selector: ['cursor-auto'],
    props: ['cursor: auto'],
  } as Property,

  default: {
    selector: ['cursor-default'],
    props: ['cursor: default'],
  } as Property,

  pointer: {
    selector: ['cursor-pointer'],
    props: ['cursor: pointer'],
  } as Property,

  grab: {
    selector: ['cursor-grab'],
    props: [
      'cursor: -webkit-grab',
      'cursor: grab',
    ],
  } as Property,

  grabbing: {
    selector: ['cursor-grabbing'],
    props: [
      'cursor: -webkit-grabbing',
      'cursor: grabbing',
    ],
  } as Property,

  wait: {
    selector: ['cursor-wait'],
    props: ['cursor: wait'],
  } as Property,

  text: {
    selector: ['cursor-text'],
    props: ['cursor: text'],
  } as Property,

  move: {
    selector: ['cursor-move'],
    props: ['cursor: move'],
  } as Property,

  not_allowed: {
    selector: ['cursor-not-allowed'],
    props: ['cursor: not-allowed'],
  } as Property,
}