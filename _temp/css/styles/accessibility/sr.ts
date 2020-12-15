import { Property } from '../../types/style';

export default {
  only: {
    selector: ['sr-only'],
    props: [
      'position: absolute',
      'width: 1px',
      'height: 1px',
      'padding: 0',
      'margin: -1px',
      'overflow: hidden',
      'clip: rect(0, 0, 0, 0)',
      'white-space: nowrap',
      'border-width: 0',
    ],
  } as Property,

  not_only: {
    selector: ['not-sr-only'],
    props: [
      'position: static',
      'width: auto',
      'height: auto',
      'padding: 0',
      'margin: 0',
      'overflow: visible',
      'clip: auto',
      'white-space: normal',
    ],
  } as Property,
};