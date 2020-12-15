import { Property } from '../../../types/style';

function create (value: string)
{
  return [
    `-webkit-user-select: ${value}`,
    `-moz-user-select: ${value}`,
    // `-ms-user-select: ${value}`,
    `user-select: ${value}`,
  ];
}

export default {
  none: {
    selector: ['user-select-none'],
    props: create('none'),
  } as Property,

  auto: {
    selector: ['user-select-auto'],
    props: create('auto'),
  } as Property,

  text: {
    selector: ['user-select-text'],
    props: create('text'),
  } as Property,

  all: {
    selector: ['user-select-all'],
    props: create('all'),
  } as Property,
}