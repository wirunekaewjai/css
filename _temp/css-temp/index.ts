import p from './presets';
import s from './styles';
import v from './values';

import { Property } from './types/property';

export { p, s, v };

export type CSS = {
  [name: string]: Sheet[];
}

export type Sheet = {
  screens: string[];
  pseudos: Pseudo[];
  properties: Property[];
}

export type Pseudo = 'hover' | 'active' | 'focus' | 'disabled' | 'placeholder' | 'before' | 'after';