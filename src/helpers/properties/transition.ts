const timing = 'cubic-bezier(0.4, 0, 0.2, 1)';
const duration = '150ms';

const properties = {
  none: 'none',
  all: 'all',
  default: 'background-color, border-color, color, fill, stroke, opacity, box-shadow, transform',
  colors: 'background-color, border-color, color, fill, stroke',
  opacity: 'opacity',
  shadow: 'box-shadow',
  transform: 'transform',
};

export default (name: keyof (typeof properties)) =>
{
  if (name === 'none')
  {
    return `
    transition-property: none;
    `;
  }

  return `
  transition-property: ${properties[name]};
  transition-timing-function: ${timing};
  transition-duration: ${duration};
  `;
};