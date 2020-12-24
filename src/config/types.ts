export interface Config {
  packages: string[];
  sources: Source[];
  module: Module;
  build: Build;
}

export interface Source {
  directory: string;
}

export interface Module {
  // .m.ts
  inputs: string[];

  // .ts
  output: string;
}

export interface Build {
  directory: string;
  entries: Generic<string[]>;
}

export interface Generic<T> {
  [name: string]: T;
}

export type PostCSSPlugins = 'autoprefixer' | 'merge-rules';