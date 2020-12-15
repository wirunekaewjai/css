import { Property } from '../../types/style';
import size from '../utils/size';

export default {
  gap: {
    x: size(['gap-x'], ['column-gap']),
    y: size(['gap-y'], ['row-gap']),
    xy: size(['gap'], ['gap']),
  },

  cols: (col: number) => ({
    selector: ['grid-cols-' + col],
    props: [
      `grid-template-columns: repeat(${col}, minmax(0, 1fr))`,
    ],
  } as Property),

  col: (span: number) => ({
    selector: ['col-span-' + span],
    props: [
      `grid-column: span ${span} / span ${span}`,
    ],
  } as Property),
}