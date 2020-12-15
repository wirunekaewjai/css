import { CSSStyle } from './types/css';

function createEnums<Enums> (name: string, enums: Enums)
{
  type Fn = (e: Enums) => string;
  
  return (value: Fn | string): CSSStyle =>
  {
    const a = typeof value === 'function' ? value(enums) : value;
  
    return [`${name}: ${a}`];
  }
}

function createNumber (name: string)
{
  function trunc (v: number)
  {
    if (v !== Math.floor(v))
    {
      return Math.floor(v * 1000) / 1000;
    }

    return v;
  }

  return (value: number): CSSStyle =>
  {
    return [`${name}: ${trunc(value)}`];
  }
}

export const flex_direction = createEnums('flex-direction', {
  row: 'row',
  row_reverse: 'row-reverse',
  column: 'column',
  column_reverse: 'column-reverse',
});

export const flex_wrap = createEnums('flex-wrap', {
  wrap: 'wrap',
  wrap_reverse: 'wrap-reverse',
  nowrap: 'nowrap',
});

export const flex_grow = createNumber('flex-grow');
export const flex_shrink = createNumber('flex-shrink');