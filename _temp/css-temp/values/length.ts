import { LengthPercentage, Unit } from '../types/length-percentage';

export function length (value: number, unit: Unit = 'px')
{
  return (value + unit) as LengthPercentage;
}