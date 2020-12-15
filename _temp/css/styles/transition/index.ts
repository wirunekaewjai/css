
const timing = 'transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1)';
const duration = 'transition-duration: 150ms';

export default {
  none: {
    name: 'transition-none',
    props: ['transition-property: none'],
  },

  all: {
    name: 'transition-all',
    props: [
      'transition-property: all',
      timing,
      duration,
    ],
  },

  default: {
    name: 'transition-default',
    props: [
      'transition-property: background-color, border-color, color, fill, stroke, opacity, box-shadow, transform',
      timing,
      duration,
    ],
  },

  colors: {
    name: 'transition-colors',
    props: [
      'transition-property: background-color, border-color, color, fill, stroke',
      timing,
      duration,
    ],
  },

  opacity: {
    name: 'transition-opacity',
    props: [
      'transition-property: opacity',
      timing,
      duration,
    ],
  },

  shadow: {
    name: 'transition-shadow',
    props: [
      'transition-property: box-shadow',
      timing,
      duration,
    ],
  },

  transform: {
    name: 'transition-transform',
    props: [
      'transition-property: transform',
      timing,
      duration,
    ],
  },
}