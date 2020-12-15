export interface Config {
  source: Source;
  module: Module;
  build: Build;
}

export interface Source {
  directory: string;
}

export interface Module {
  input: {
    // .m.ts
    extension: string;
  };

  output: {
    // .ts
    extension: string;
  };
}

export interface Build {
  directory: string;
  entries: Generic<string[]>;
}

export interface Generic<T> {
  [name: string]: T;
}