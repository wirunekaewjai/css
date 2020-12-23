export default `
import config from '@wirunekaewjai/css/config';

export default config({
  packages: [
    '@wirunekaewjai/css',
  ],

  sources: [
    {
      directory: 'src',
    },
  ],

  module: {
    inputs: ['.m.ts', '.m.js'],
    output: '.js',
  },

  build: {
    directory: 'src',
    entries: {
      'style': [
        'src/index.tsx',
      ],
    },
  },
});
`.trim();