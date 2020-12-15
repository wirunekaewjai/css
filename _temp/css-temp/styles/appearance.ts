import { Property } from '../types/property';

export function appearance (appearance: 'none'): Property
{
  return {
    items: [
      `-webkit-appearance: ${appearance}`,
      `-moz-appearance: ${appearance}`,
      `appearance: ${appearance}`,
    ],
  }
}