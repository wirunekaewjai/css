export type CSS = {
  [name: string]: CSSClass[];
};

type CSSClass = {
  screen?: string;
  styles: CSSStyle[];
};

type CSSStyle = CSSParentStyle | CSSLeafStyle;
type CSSParentStyle = { [selector: string]: CSSLeafStyle };
type CSSLeafStyle = string | string[];