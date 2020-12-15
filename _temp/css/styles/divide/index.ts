import color from '../utils/color';
import style from '../border/style';
import width from '../border/width';

const child = '> * + *';

export default {
  color: color(['divide-color', child], ['border-color']),
  style: style(['divide-style', child], ['divide-style']),

  x: width(['divide-x', child], ['border-left-width']),
  y: width(['divide-y', child], ['border-top-width']),

  reverse: {
    x: width(['divide-reverse-x', child], ['border-right-width']),
    y: width(['divide-reverse-y', child], ['border-bottom-width']),
  },
}