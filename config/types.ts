
export interface CSSConfigInput {
  source: {
    dir: string;
    exts?: string[];
  };

  out: {
    classes?: {
      ext?: string;
    };

    css: {
      dir: string;
      entries: {
        [name: string]: string[];
      }
    };
  };

  externals?: string[];
}

export interface CSSConfig {
  source: {
    dir: string;
    exts: string[];
  };

  out: {
    classes: {
      ext: string;
    };

    css: {
      dir: string;
      entries: {
        [name: string]: string[];
      }
    };
  };

  externals: string[];
}
