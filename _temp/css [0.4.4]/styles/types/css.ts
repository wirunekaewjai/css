export type CSS = {
  [name: string]: CSSClass[];
};

export type CSSClass = {
  screen?: string;
  styles: CSSStyle[];
};

export type CSSStyle = string | string[] | string[][] | {
  [selector: string]: CSSStyle[];
};