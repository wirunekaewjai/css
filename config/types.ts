
type Include = 'variables';

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
        [name: string]: string[];
      }
    };
  };

  includes?: Include[];
  externals?: string[];
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
        [name: string]: string[];
      }
    };
  };

  includes: Include[];
  externals: string[];
}
