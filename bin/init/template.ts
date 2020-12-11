export default `
import c from '@wirunekaewjai/css/config';

export default c({
  source: {
    dir: 'src',
    ext: '.s.ts',
  },

  out: {
    classes: {
      ext: '.c.js',
    },

    css: {
      dir: 'src',
      entries: {
        'home': 'src/index.tsx',
      },
    },
  },
});
`.trim();