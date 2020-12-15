import { Length, Unit as U1 } from './length';
import { Percentage, Unit as U2 } from './percentage';

export type Unit = U1 | U2;
export type LengthPercentage = Length | Percentage;