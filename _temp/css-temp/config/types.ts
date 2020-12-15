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
      entries: {
        [name: string]: string;
      }
    };
  };

  externals?: string[];
  extends?: {
    breakpoints?: { [name: string]: number };
  
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
      entries: {
        [name: string]: string;
      }
    };
  };

  externals: string[];
  extends: {
    breakpoints: { [name: string]: number };
  
    font: {
      family: {
        sans: string;
        serif: string;
        mono: string;
      };
    };
  },
}