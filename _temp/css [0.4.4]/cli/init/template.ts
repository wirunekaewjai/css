export default `
import c from '@wirunekaewjai/devtools/css/config';

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
      base: 'base.css,
      entries: {
        'home': 'src/index.tsx',
      },
    },
  },

  extends: {
    screens: {
      sm: 640,
      md: 768,
      lg: 1024,
      xl: 1280,
    },
  },
});
`.trim();