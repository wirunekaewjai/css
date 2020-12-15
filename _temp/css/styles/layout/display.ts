import { Property } from '../../types/style';

export default {
  flex: {
    selector: ['flex'],
    props: [
      // 'display: -webkit-box',
      // 'display: -ms-flexbox',
      'display: flex',
    ],
  } as Property,

  grid: {
    selector: ['grid'],
    props: [
      // 'display: -ms-grid',
      'display: grid',
    ],
  } as Property,
}