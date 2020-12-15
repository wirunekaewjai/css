export interface CSSConfigInput {
  source: {
    dir: string;
    ext?: string;
  };

  out: {
    classes?: {
      ext?: string;
    };

    css: {
      dir: string;
      base: string;
      entries: {
        [name: string]: string;
      }
    };
  };

  externals?: string[];
  extends?: {
    screens?: Screens;
  
    font?: {
      family?: {
        sans?: string;
        serif?: string;
        mono?: string;
      };
    };
  };
}

export interface CSSConfig {
  source: {
    dir: string;
    ext: string;
  };

  out: {
    classes: {
      ext: string;
    };

    css: {
      dir: string;
      base: string;
      entries: {
        [name: string]: string;
      }
    };
  };

  externals: string[];
  extends: {
    screens: Screens;
  
    font: {
      family: {
        sans: string;
        serif: string;
        mono: string;
      };
    };
  },
}

export interface Screens { [name: string]: number };