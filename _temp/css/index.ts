import { Style, Property } from './types/style';
import instancer from './styles';

export default instancer;
export {
  Style,
  Property,
};

export function create (styles: Style[])
{
  return styles;
}