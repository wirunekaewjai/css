
export interface Args {
  config?: string;
  watch?: boolean;
}

export interface Generic<T> {
  [key: string]: T;
}