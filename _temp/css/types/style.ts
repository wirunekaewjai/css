export interface Style {
  name: string;
  data: Data[];
};

export interface Data {
  breakpoints: string[];
  pseudos?: PseudoClasses[];
  props: Property[];
};

export type PseudoClasses = 
'hover' | 'active' | 'focus' | 'disabled' | 
'placeholder';

export interface Property {
  selector: [string, string?];
  props: string[];
};