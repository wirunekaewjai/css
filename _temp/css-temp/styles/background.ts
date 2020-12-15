import { Property } from '../types/property';
import { Color } from '../types/color';
import { Global } from '../types/global';

type Attachment = 'fixed' | 'local' | 'scroll';
export function background_attachment (a1: Attachment | Global, a2?: Attachment): Property
{
  const s = [a1, a2].filter(e => !!e).join(' ');

  return {
    items: [`background-attachment: ${s}`],
  }
}

export function background_color (color: Color | Global): Property
{
  return {
    items: [`background-color: ${color}`],
  }
}

export function background_image (...images: string[]): Property
{
  const s = images.filter(e => !!e).join(', ');

  return {
    items: [`background-image: ${s}`],
  }
}

type Position = 'top' | 'right' | 'bottom' | 'left' | 'center';
export function background_position (p1: Position | Global, p2?: Position): Property
{
  const p = [p1, p2].filter(e => !!e).join(' ');

  return {
    items: [`background-position: ${p}`],
  }
}

export function background_repeat (repeat: 'no-repeat' | 'repeat' | 'repeat-x' | 'repeat-y' | 'round' | 'space' | Global): Property
{
  return {
    items: [`background-repeat: ${repeat}`],
  }
}

type Size = 'auto' | 'cover' | 'contain' | '100%';
export function background_size (size1: Size | Global, size2?: Size): Property
{
  const s = [size1, size2].filter(e => !!e).join(' ');

  return {
    items: [`background-size: ${s}`],
  }
}