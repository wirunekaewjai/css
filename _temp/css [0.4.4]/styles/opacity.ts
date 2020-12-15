import { CSSStyle } from './types/css';

function create_opacity ()
{
  function trunc (v: number)
  {
    if (v !== Math.floor(v))
    {
      return Math.floor(v * 1000) / 1000;
    }

    return v;
  }

  return (opacity: number): CSSStyle =>
  {
    return [
      `opacity: ${trunc(opacity)}`,
    ];
  };
}

export const opacity = create_opacity;