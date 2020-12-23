import size from './size';

const radiuses = {
  'none': 'none',
  'rounded': '9999px',
  'xs': size(0.5),
  'sm': size(1),
  'md': size(1.5),
  'lg': size(2),
  'xl': size(3),
  '2xl': size(4),
  '3xl': size(6),
}

export default (name: keyof (typeof radiuses)) =>
{
  return radiuses[name];
}