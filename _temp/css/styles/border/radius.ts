import { Property } from '../../types/style';
import size, { toREM, Unit } from '../utils/size';

const presets = {
  'none': 'none',
  'xs': `${0.5 * toREM}rem`,
  'sm': `${1 * toREM}rem`,
  'md': `${1.5 * toREM}rem`,
  'lg': `${2 * toREM}rem`,
  'xl': `${3 * toREM}rem`,
  '2xl': `${4 * toREM}rem`,
  '3xl': `${6 * toREM}rem`,
  'full': '9999px',
};

type Presets = typeof presets;
type Preset = keyof Presets;

export default function create ([k, child]: [string, string?], ns: string[])
{
  return (v: number | Preset, u?: Unit): Property => {
    if (typeof v === 'number')
    {
      return size([k, child], ns)(v, u);
    }
    else
    {
      return {
        selector: [[k, v].join('-')],
        props: ns.map(n => `${n}: ${presets[v]}`),
      };
    }
  };
}