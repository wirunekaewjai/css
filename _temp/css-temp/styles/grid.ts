import { Property } from '../types/property';

export function gap (gap: string): Property
{
  return {
    items: [`gap: ${gap}`],
  }
}

export function gap_x (gap: string): Property
{
  return {
    items: [`column-gap: ${gap}`],
  }
}

export function gap_y (gap: string): Property
{
  return {
    items: [`row-gap: ${gap}`],
  }
}

export function grid_cols (column: number): Property
{
  return {
    items: [
      `grid-template-columns: repeat(${column}, minmax(0, 1fr))`,
    ],
  }
}

export function grid_col (span: number): Property
{
  return {
    items: [
      `grid-column: span ${span} / span ${span}`,
    ],
  }
}