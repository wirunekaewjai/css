import { toREM } from '../../consts';

function create (k: string, vs: number[])
{
  return {
    name: 'text-' + k,
    props: [
      `font-size: ${vs[0] * toREM}rem`,
      `line-height: ${vs[1] * toREM}rem`
    ],
  };
}

export default {
  xs: create('xs', [3, 4]),
  sm: create('sm', [3.5, 5]),
  md: create('md', [4, 6]),
  lg: create('lg', [4.5, 7]),
  xl: create('xl', [5, 7]),
  _2xl: create('2xl', [6, 8]),
  _3xl: create('3xl', [7.5, 9]),
  _4xl: create('4xl', [9, 10]),
  _5xl: create('5xl', [12, 12]),
  _6xl: create('6xl', [15, 15]),
  _7xl: create('7xl', [18, 18]),
  _8xl: create('8xl', [24, 24]),
  _9xl: create('9xl', [32, 32]),
};