"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = `
import config from '@wirunekaewjai/css/config';

export default config({
  source: {
    directory: 'src',
  },

  module: {
    input: {
      extension: '.m.ts',
    },

    output: {
      extension: '.ts',
    },
  },

  build: {
    directory: 'src/styles',
    entries: {
      'home': [
        'src/index.tsx',
      ],
    },
  },
});
`.trim();
