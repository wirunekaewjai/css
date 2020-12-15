import { CSSStyle } from './types/css';

function create_gap (name: string)
{
  return (gap: number | string): CSSStyle =>
  {
    const a = typeof gap === 'string' ? gap : gap + 'px';
    return [`${name}: ${a}`];
  };
}

function create_grid_cols ()
{
  return (column: number): CSSStyle =>
  {
    return [
      `grid-template-columns: repeat(${column}, minmax(0, 1fr))`,
    ];
  };
}

function create_grid_col ()
{
  return (span: number): CSSStyle =>
  {
    return [
      `grid-column: span ${span} / span ${span}`,
    ];
  };
}

export const gap = create_gap('gap');
export const gap_x = create_gap('column-gap');
export const gap_y = create_gap('row-gap');
export const grid_cols = create_grid_cols();
export const grid_col = create_grid_col();