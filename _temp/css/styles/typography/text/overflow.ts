
export default {
  truncate: {
    name: 'truncate',
    props: [
      'overflow: hidden',
      'text-overflow: ellipsis',
      'white-space: nowrap',
    ],
  },

  ellipsis: {
    name: 'overflow-ellipsis',
    props: ['text-overflow: ellipsis'],
  },

  clip: {
    name: 'overflow-clip',
    props: ['text-overflow: clip'],
  },
}