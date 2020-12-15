import color from '../utils/color';
import style from './style';
import radius from './radius';
import width from './width';

export default {
  color: color(['border-color'], ['border-color']),
  style: style(['border-style'], ['border-style']),
  width: width(['border-width'], ['border-width']),
  radius: radius(['border-radius'], ['border-radius']),

  top_left: {
    radius: radius(['border-top-left-radius'], ['border-top-left-radius']),
  },

  top: {
    color: color(['border-top-color'], ['border-top-color']),
    style: style(['border-top-style'], ['border-top-style']),
    width: width(['border-top-width'], ['border-top-width']),
    radius: radius(['border-top-radius'], ['border-top-left-radius', 'border-top-right-radius']),
  },

  top_right: {
    radius: radius(['border-top-right-radius'], ['border-top-right-radius']),
  },

  right: {
    color: color(['border-right-color'], ['border-right-color']),
    style: style(['border-right-style'], ['border-right-style']),
    width: width(['border-right-width'], ['border-right-width']),
    radius: radius(['border-right-radius'], ['border-top-right-radius', 'border-bottom-right-radius']),
  },

  bottom_right: {
    radius: radius(['border-bottom-right-radius'], ['border-bottom-right-radius']),
  },

  bottom: {
    color: color(['border-bottom-color'], ['border-bottom-color']),
    style: style(['border-bottom-style'], ['border-bottom-style']),
    width: width(['border-bottom-width'], ['border-bottom-width']),
    radius: radius(['border-bottom-radius'], ['border-bottom-left-radius', 'border-bottom-right-radius']),
  },

  bottom_left: {
    radius: radius(['border-bottom-left-radius'], ['border-bottom-left-radius']),
  },

  left: {
    color: color(['border-left-color'], ['border-left-color']),
    style: style(['border-left-style'], ['border-left-style']),
    width: width(['border-left-width'], ['border-left-width']),
    radius: radius(['border-left-radius'], ['border-top-left-radius', 'border-bottom-left-radius']),
  },
};