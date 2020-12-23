import { Config } from './types';

export default function create (input: Config)
{
  const out: Config = {
    packages: input.packages,
    sources: input.sources,
    // source: {
    //   directory: input.source.directory,
    // },

    module: {
      inputs: input.module.inputs,
      output: input.module.output,
    },

    build: {
      directory: input.build.directory,
      entries: input.build.entries,
    },
  };

  return out;
}