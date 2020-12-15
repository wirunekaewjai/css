
export function transition (name: 'none' | 'all' | 'default' | 'colors' | 'opacity' | 'shadow' | 'transform')
{
  if (name === 'none')
  {
    return `none`;
  }

  const timing = 'cubic-bezier(0.4, 0, 0.2, 1)';
  const duration = '150ms';

  if (name === 'default')
  {
    return `background-color, border-color, color, fill, stroke, opacity, box-shadow, transform ${duration} ${timing}`;
  }
  else if (name === 'colors')
  {
    return `background-color, border-color, color, fill, stroke ${duration} ${timing}`;
  }

  return `${name} ${duration} ${timing}`;
}