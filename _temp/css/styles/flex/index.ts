import { Property } from '../../types/style';

export default {
  direction: {
    row: {
      selector: ['flex-row'],
      props: ['flex-direction: row'],
    } as Property,

    row_reverse: {
      selector: ['flex-row-reverse'],
      props: ['flex-direction: row-reverse'],
    } as Property,

    column: {
      selector: ['flex-column'],
      props: ['flex-direction: column'],
    } as Property,

    column_reverse: {
      selector: ['flex-column-reverse'],
      props: ['flex-direction: column-reverse'],
    } as Property,
  },

  nowrap: {
    selector: ['flex-nowrap'],
    props: ['flex-wrap: nowrap'],
  } as Property,

  wrap: {
    selector: ['flex-wrap'],
    props: ['flex-wrap: wrap'],
  } as Property,

  wrap_reverse: {
    selector: ['flex-wrap-reverse'],
    props: ['flex-wrap: wrap-reverse'],
  } as Property,

  nogrow: {
    selector: ['flex-grow-0'],
    props: ['flex-grow: 0'],
  } as Property,

  grow: {
    selector: ['flex-grow'],
    props: ['flex-grow: 1'],
  } as Property,

  noshrink: {
    selector: ['flex-shrink-0'],
    props: ['flex-shrink: 0'],
  } as Property,

  shrink: {
    selector: ['flex-shrink'],
    props: ['flex-shrink: 1'],
  } as Property,
}