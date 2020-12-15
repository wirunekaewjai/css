import { Property } from '../../types/style';

export const units = {
  'px': 'px',
  '%': '%',
  'em': 'em',
  'rem': 'rem',
  'vw': 'vw',
  'vh': 'vh',
  'vmin': 'vmin',
  'vmax': 'vmax',
};

export const aliases = {
  'px': 'px',
  '%': 'pct',
  'em': 'em',
  'rem': 'rem',
  'vw': 'vw',
  'vh': 'vh',
  'vmin': 'vmin',
  'vmax': 'vmax',
};

export type Units = typeof units;
export type Unit = keyof Units;

export const toREM = 0.25;
export function sizeWithEnums<T extends object> ([k, child]: [string, string?], ns: string[], enums: T)
{
  type E = keyof T;

  return (v: number | E, u?: Unit): Property => {
    if (typeof v === 'number')
    {
      return create([k, child], ns)(v, u);
    }

    const ev = enums[v];

    if (Array.isArray(ev))
    {
      const eva = ev as any[];

      return {
        selector: [[k, v].join('-'), child],
        props: ns.map(n => eva.map(e => `${n}: ${e}`).join('; ')),
      };
    }

    return {
      selector: [[k, v].join('-'), child],
      props: ns.map(n => `${n}: ${ev}`),
    };
  };
}

export default function create ([k, child]: [string, string?], ns: string[])
{
  return (v: number, u?: Unit): Property => {
    if (u && u in units)
    {
      const alias = aliases[u];
      const unit = units[u];

      return {
        selector: [[k, alias, v].join('-'), child],
        props: ns.map(n => `${n}: ${v}${unit}`),
      }
    }

    return {
      selector: [[k, v].join('-'), child],
      props: ns.map(n => `${n}: ${v * toREM}rem`),
    };
  };
}

// export default function create<T> ([k, child]: [string, string?], ns: string[], nested?: T)
// {
//   const result = {
//     n: (v: number) => ({
//       selector: [[k, v].join('-'), child],
//       props: ns.map(n => `${n}: ${v * toREM}rem`),
//     } as Property),

//     px: (v: number) => ({
//       selector: [[k, 'px', v].join('-'), child],
//       props: ns.map(n => `${n}: ${v}px`),
//     } as Property),

//     em: (v: number) => ({
//       selector: [[k, 'em', v].join('-'), child],
//       props: ns.map(n => `${n}: ${v}em`),
//     } as Property),

//     rem: (v: number) => ({
//       selector: [[k, 'rem', v].join('-'), child],
//       props: ns.map(n => `${n}: ${v}rem`),
//     } as Property),

//     percent: (percentage: number) => ({
//       selector: [[k, 'percentage', percentage].join('-'), child],
//       props: ns.map(n => `${n}: ${percentage}%`),
//     } as Property),
//   };

//   type Result = typeof result & T;

//   return {
//     ...result,
//     ...nested,
//   } as Result;
// }