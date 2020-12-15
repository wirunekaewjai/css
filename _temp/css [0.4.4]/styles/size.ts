import { CSSStyle } from './types/css';
import { global } from './utils/global';
import { toREM, screen_size } from './utils/length';

const min = [
  '-webkit-min-content',
  '-moz-min-content',
  'min-content',
];

const max = [
  '-webkit-max-content',
  '-moz-max-content',
  'max-content',
];

function getValue (v: number | string | string[])
{
  if (typeof v === 'string')
  {
    return v;
  }
  else if (typeof v === 'number')
  {
    return (v * toREM) + 'rem';
  }

  return v;
}

function create<Enums> (name: string, enums: Enums)
{
  type V = number | string | string[];
  type Fn = (e: Enums) => V;

  return (value: Fn | V): CSSStyle =>
  {
    const s = typeof value === 'function' ? getValue(value(enums)) : getValue(value);

    if (Array.isArray(s))
    {
      return s.map(e => `${name}: ${e}`);
    }

    return [`${name}: ${s}`];
  };
}

export const height = create('height', {
  auto: 'auto',
  ...global,
});

export const min_height = create('min-height', global);
export const max_height = create('max-height', {
  auto: 'auto',
  min,
  max,

  ...global,
});

export const width = create('width', {
  screen_size,

  auto: 'auto',

  min,
  max,

  ...global,
});

export const min_width = create('min-width', {
  screen_size,

  auto: 'auto',
  
  min,
  max,

  ...global,
});

export const max_width = create('max-width', {
  screen_size,

  none: 'none',
  
  min,
  max,

  ...global,
});