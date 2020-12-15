import { Property } from '../../types/style';

export default {
  top_left: {
    selector: ['bg-left-top'],
    props: ['background-position: left top'],
  } as Property,

  top: {
    selector: ['bg-top'],
    props: ['background-position: top'],
  } as Property,

  top_right: {
    selector: ['bg-right-top'],
    props: ['background-position: right top'],
  } as Property,

  right: {
    selector: ['bg-right'],
    props: ['background-position: right'],
  } as Property,

  bottom_right: {
    selector: ['bg-right-bottom'],
    props: ['background-position: right bottom'],
  } as Property,

  bottom: {
    selector: ['bg-bottom'],
    props: ['background-position: bottom'],
  } as Property,

  bottom_left: {
    selector: ['bg-left-bottom'],
    props: ['background-position: left bottom'],
  } as Property,

  left: {
    selector: ['bg-left'],
    props: ['background-position: left'],
  } as Property,
};