import size from '../values/size';

const sizes = {
  'xs': [3, 4],
  'sm': [3.5, 5],
  'md': [4, 6],
  'lg': [4.5, 7],
  'xl': [5, 7],
  '2xl': [6, 8],
  '3xl': [7.5, 9],
  '4xl': [9, 10],
  '5xl': [12, 12],
  '6xl': [15, 15],
  '7xl': [18, 18],
  '8xl': [24, 24],
  '9xl': [32, 32],
};

export default (name: keyof (typeof sizes)) =>
{
  const [a, b] = sizes[name];
  return `font-size: ${size(a)}; line-height: ${size(b)};`
};