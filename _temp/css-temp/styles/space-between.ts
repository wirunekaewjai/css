import { Property } from '../types/property';
import { LengthPercentage } from '../types/length-percentage';

type Value = LengthPercentage;

export function space_between_x (space: Value): Property
{
  return {
    child: '> * + *',
    items: [
      `margin-left: ${space}`,
    ],
  }
}

export function space_between_y (space: Value): Property
{
  return {
    child: '> * + *',
    items: [
      `margin-top: ${space}`,
    ],
  }
}