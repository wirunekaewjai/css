export default `
import c from '@wirunekaewjai/css/config';

export default c({
  source: {
    dir: 'src',
    ext: '.css',
  },

  out: {
    classes: {
      ext: '.c.js',
    },

    css: {
      dir: 'src',
      entries: {
        'home': [
          'src/index.tsx',
        ],
      },
    },
  },

  includes: [
    'variables',
  ],
});
`.trim();