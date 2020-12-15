import size from '../../utils/size';

const childSelector = '> * + *';

export default {
  x: size('space-x-', ['margin-left'], childSelector),
  y: size('space-y-', ['margin-top'], childSelector),
}