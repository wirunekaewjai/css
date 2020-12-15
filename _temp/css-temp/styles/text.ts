import { Property } from '../types/property';
import { Global } from '../types/global';

export function text_align (align: 'left' | 'center' | 'right' | 'justify' | Global): Property
{
  return {
    items: [`text-align: ${align}`],
  } 
}

export function text_break (type: 'normal' | 'words' | 'all'): Property
{
  if (type === 'normal')
  {
    return {
      items: [
        'overflow-wrap: normal',
        'word-break: normal',
      ],
    };
  }
  else if (type === 'words')
  {
    return {
      items: ['overflow-wrap: break-word'],
    };
  }

  return {
    items: ['word-break: break-all'],
  };
}

export function text_overflow (type: 'truncate' | 'ellipsis' | 'clip'): Property
{
  if (type === 'truncate')
  {
    return {
      items: [
        'overflow: hidden',
        'text-overflow: ellipsis',
        'white-space: nowrap',
      ],
    };
  }
  else if (type === 'ellipsis')
  {
    return {
      items: ['text-overflow: ellipsis'],
    };
  }

  return {
    items: ['text-overflow: clip'],
  };
}

export function text_wrap (type: 'normal' | 'nowrap' | 'pre' | 'pre-line' | 'pre-wrap'): Property
{
  return {
    items: [`white-space: ${type}`],
  }
}
