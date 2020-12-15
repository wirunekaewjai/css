import { CSSStyle } from './types/css';

export function sr (only: boolean): CSSStyle
{
  if (!!only)
  {
    return [
      'position: absolute',
      'width: 1px',
      'height: 1px',
      'padding: 0',
      'margin: -1px',
      'overflow: hidden',
      'clip: rect(0, 0, 0, 0)',
      'white-space: nowrap',
      'border-width: 0',
    ];
  }

  return [
    'position: static',
    'width: auto',
    'height: auto',
    'padding: 0',
    'margin: 0',
    'overflow: visible',
    'clip: auto',
    'white-space: normal',
  ];
}