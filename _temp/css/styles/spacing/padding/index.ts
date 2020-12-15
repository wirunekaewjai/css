import size from '../../utils/size';

export default {
  ...size('p-', ['padding']),

  x: size('px-', ['padding-left', 'padding-right']),
  y: size('py-', ['padding-top', 'padding-bottom']),

  top: size('pt-', ['padding-top']),
  right: size('pr-', ['padding-right']),
  bottom: size('pb-', ['padding-bottom']),
  left: size('pl-', ['padding-left']),
}