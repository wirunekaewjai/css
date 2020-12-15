import { Property } from '../types/property';
import { Time } from '../types/time';

type Transition1 = `${string} ${Time}`;
type Transition2 = `${string} ${Time} ${string}`;
type Transition3 = `${string} ${Time} ${string} ${Time}`;
type Transition = Transition1 | Transition2 | Transition3;

export function transition (...transition: Transition[]): Property
{
  const t = transition.filter(e => !!e).join(', ');

  return {
    items: [
      `transition: ${t}`,
    ],
  }
}

export function transition_property (...name: string[]): Property
{
  const t = name.filter(e => !!e).join(', ');

  return {
    items: [
      `transition-property: ${t}`,
    ],
  }
}

export function transition_duration (...duration: Time[]): Property
{
  const t = duration.filter(e => !!e).join(', ');

  return {
    items: [
      `transition-duration: ${t}`,
    ],
  }
}

export function transition_delay (...delay: Time[]): Property
{
  const t = delay.filter(e => !!e).join(', ');

  return {
    items: [
      `transition-delay: ${t}`,
    ],
  }
}

export function transition_timing_function (...fn: string[]): Property
{
  const t = fn.filter(e => !!e).join(', ');

  return {
    items: [
      `transition-timing-function: ${t}`,
    ],
  }
}