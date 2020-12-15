import { Config } from './types';

export default function create (input: Config)
{
  const out: Config = {
    source: {
      directory: input.source.directory,
    },

    module: {
      input: {
        extension: input.module.input.extension,
      },
      output: {
        extension: input.module.output.extension,
      },
    },

    build: {
      directory: input.build.directory,
      entries: input.build.entries,
    },
  };

  return out;
}