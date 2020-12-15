export interface Stylesheet {
  type: 'stylesheet';
  stylesheet: {
    rules: Array<Supports | Media | Rule>;
  };
}

export interface Media {
  type: 'media';
  media: string;
  rules: Array<Supports | Media | Rule>;
}

export interface Supports {
  type: 'supports';
  supports: string;
  rules: Array<Supports | Media | Rule>;
}

export interface Rule {
  type: 'rule' | 'page';
  selectors: string[];
  declarations: Declaration[];
}

export interface Declaration {
  type: 'declaration';
  property: string;
  value: string;
}