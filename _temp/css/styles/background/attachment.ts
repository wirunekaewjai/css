import { Property } from '../../types/style';

export default {
  fixed: {
    selector: ['bg-fixed'],
    props: ['background-attachment: fixed'],
  } as Property,

  local: {
    selector: ['bg-local'],
    props: ['background-attachment: local'],
  } as Property,
  
  scroll: {
    selector: ['bg-scroll'],
    props: ['background-attachment: scroll'],
  } as Property,
};