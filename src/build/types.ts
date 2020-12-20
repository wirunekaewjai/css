
export interface Args {
  config?: string;
  watch?: boolean;
}

export interface Generic<T> {
  [key: string]: T;
}

export interface Styles {
  [key: string]: Styles | string[];
}

// export interface Style {
//   [key: string]: Style | string;
// }