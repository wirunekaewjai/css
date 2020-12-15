import { CSSStyle } from './types/css';

export function text_overflow (type: 'truncate' | 'ellipsis' | 'clip'): CSSStyle
{
  if (type === 'truncate')
  {
    return [
      'overflow: hidden',
      'text-overflow: ellipsis',
      'white-space: nowrap',
    ];
  }
  else if (type === 'ellipsis')
  {
    return ['text-overflow: ellipsis'];
  }

  return ['text-overflow: clip'];
}