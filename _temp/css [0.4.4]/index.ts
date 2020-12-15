import { CSS } from './styles/types/css';
import { Pseudo } from './styles/types/pseudo';

import s from './styles';

export {
  CSS,
  Pseudo,

  s,
}

type Styles = typeof s;
type Fn = (styles: Styles) => CSS;

export default function create (css: Fn | CSS)
{
  if (typeof css === 'function')
  {
    return css(s);
  }

  return css;
}