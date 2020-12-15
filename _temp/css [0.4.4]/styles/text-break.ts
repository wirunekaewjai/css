import { CSSStyle } from './types/css';

export function text_break (type: 'normal' | 'words' | 'all'): CSSStyle
{
  if (type === 'normal')
  {
    return [
      'overflow-wrap: normal',
      'word-break: normal',
    ];
  }
  else if (type === 'words')
  {
    return ['overflow-wrap: break-word'];
  }

  return ['word-break: break-all'];
}