import { Property } from '../../types/style';

export default {
  auto: {
    selector: ['bg-auto'],
    props: ['background-size: auto'],
  } as Property,

  cover: {
    selector: ['bg-cover'],
    props: ['background-size: cover'],
  } as Property,
  
  contain: {
    selector: ['bg-contain'],
    props: ['background-size: contain'],
  } as Property,
};