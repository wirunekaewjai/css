export interface Generic<T> {
  [key: string]: T;
}

export interface CSSObject {
  [name: string]: string | CSSObject;
}

export interface CSSCollections {
  modules: Generic<CSSSlugs>;
  values: CSSValues;
}

export interface CSSCollection {
  slugs: CSSSlugs;
  values: CSSValues;
}

export interface CSSValue {
  type: 'tag' | 'slug';
  name: string;
  selector?: string;
}

export type CSSValues = {
  [key: string]: CSSValues | Array<CSSValue | string>;
};

export type CSSSlugs = Generic<string[]>;
