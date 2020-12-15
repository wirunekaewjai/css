import { CSSStyle } from './types/css';
import { join } from './utils/array';

function create_transition ()
{
  type Transition = {
    property: string | string[];
    duration?: string;
    timing?: string;
    delay?: string;
  };

  const timing = 'cubic-bezier(0.4, 0, 0.2, 1)';
  const duration = '150ms';

  const t_none: Transition = {
    property: 'none',
  };

  const t_all: Transition = {
    property: 'all',
    duration,
    timing,
  };

  const t_default: Transition = {
    property: 'background-color, border-color, color, fill, stroke, opacity, box-shadow, transform',
    duration,
    timing,
  };

  const t_colors: Transition = {
    property: 'background-color, border-color, color, fill, stroke',
    duration,
    timing,
  };

  const t_opacity: Transition = {
    property: 'opacity',
    duration,
    timing,
  };

  const t_shadow: Transition = {
    property: 'box-shadow',
    duration,
    timing,
  };

  const t_transform: Transition = {
    property: 'transform',
    duration,
    timing,
  };

  const enums = {
    none: t_none,
    all: t_all,
    default: t_default,
    colors: t_colors,
    opacity: t_opacity,
    shadow: t_shadow,
    transform: t_transform,
  };

  type Enums = typeof enums;
  type V = string | Transition | (string | Transition)[];
  type Fn = (e: Enums) => V;

  return (transition: Fn | V): CSSStyle =>
  {
    const t = typeof transition === 'function' ? transition(enums) : transition;

    if (Array.isArray(t))
    {
      const items: string[] = [];
      const properties: string[] = [];
      const durations: string[] = [];
      const timings: string[] = [];
      const delays: string[] = [];

      for (const e of t)
      {
        if (typeof e === 'string')
        {
          items.push(e);
        }
        else
        {
          if (e.property)
          {
            properties.push(`transition-property: ${e.property}`);
          }

          if (e.duration)
          {
            durations.push(`transition-duration: ${e.duration}`);
          }

          if (e.timing)
          {
            timings.push(`transition-timing-function: ${e.timing}`);
          }

          if (e.delay)
          {
            delays.push(`transition-delay: ${e.delay}`);
          }
        }
      }

      const result: string[] = [];

      if (items.length > 0)
      {
        result.push(`transition: ${join(items, ', ')}`);
      }

      if (properties.length > 0)
      {
        result.push(`transition-property: ${join(properties, ', ')}`);
      }

      if (durations.length > 0)
      {
        result.push(`transition-duration: ${join(durations, ', ')}`);
      }

      if (timings.length > 0)
      {
        result.push(`transition-timing-function: ${join(timings, ', ')}`);
      }

      if (delays.length > 0)
      {
        result.push(`transition-delay: ${join(delays, ', ')}`);
      }

      return result;
    }
    else
    {
      if (typeof t === 'string')
      {
        return [`transition: ${t}`];
      }

      const e: string[] = [];

      if (t.property)
      {
        e.push(`transition-property: ${t.property}`);
      }

      if (t.duration)
      {
        e.push(`transition-duration: ${t.duration}`);
      }

      if (t.timing)
      {
        e.push(`transition-timing-function: ${t.timing}`);
      }

      if (t.delay)
      {
        e.push(`transition-delay: ${t.delay}`);
      }

      return e;
    }
  }
}

export const transition = create_transition();

export function transition_property (...name: string[]): CSSStyle
{
  return [
    `transition-property: ${join(name, ', ')}`,
  ];
}

export function transition_duration (...duration: string[]): CSSStyle
{
  return [
    `transition-duration: ${join(duration, ', ')}`,
  ];
}

export function transition_delay (...delay: string[]): CSSStyle
{
  return [
    `transition-delay: ${join(delay, ', ')}`,
  ];
}

export function transition_timing_function (...fn: string[]): CSSStyle
{
  return [
    `transition-timing-function: ${join(fn, ', ')}`,
  ];
}