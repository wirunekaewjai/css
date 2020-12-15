import { Property } from '../../types/style';

export default function create ([k, child]: [string, string?], ns: string[])
{
  return {
    solid: {
      selector: [[k, 'solid'].join('-'), child],
      props: ns.map(n => `${n}: solid`),
    } as Property,
  
    dashed: {
      selector: [[k, 'dashed'].join('-'), child],
      props: ns.map(n => `${n}: dashed`),
    } as Property,
  
    dotted: {
      selector: [[k, 'dotted'].join('-'), child],
      props: ns.map(n => `${n}: dotted`),
    } as Property,
  
    double: {
      selector: [[k, 'double'].join('-'), child],
      props: ns.map(n => `${n}: double`),
    } as Property,
  
    none: {
      selector: [[k, 'none'].join('-'), child],
      props: ns.map(n => `${n}: none`),
    } as Property,
  };
}