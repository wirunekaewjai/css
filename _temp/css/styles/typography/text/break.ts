
export default {
  normal: {
    name: 'break-normal',
    props: [
      'overflow-wrap: normal',
      'word-break: normal',
    ],
  },

  words: {
    name: 'break-words',
    props: ['overflow-wrap: break-word'],
  },

  all: {
    name: 'break-all',
    props: ['word-break: break-all'],
  },
}