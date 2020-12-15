import { Property } from '../../types/style';
import size, { Unit } from '../utils/size';

export default function create ([k, child]: [string, string?], ns: string[])
{
  return (v: number, u: Unit = 'px'): Property => {
    return size([k, child], ns)(v, u);
  };
}