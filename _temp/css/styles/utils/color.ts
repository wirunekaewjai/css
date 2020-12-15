import { Property } from '../../types/style';
import { Opacity } from '../../types/color';

export function hexToValue (hex: string, opacity: Opacity = 100)
{
  let h = hex.startsWith('#') ? hex.slice(1) : hex;

  if (opacity === 100)
  {
    return '#' + h;
  }

  // rrggbb
  const r = parseInt(h.charAt(0) + h.charAt(1), 16);
  const g = parseInt(h.charAt(2) + h.charAt(3), 16);
  const b = parseInt(h.charAt(4) + h.charAt(5), 16);
  const a = opacity / 100;

  return `rgba(${r}, ${g}, ${b}, ${a})`;
}

export function rgbToValue (r: number, g: number, b: number, opacity: Opacity = 100)
{
  if (opacity === 100)
  {
    const r1 = r.toString(16).padStart(2, '0');
    const g1 = g.toString(16).padStart(2, '0');
    const b1 = b.toString(16).padStart(2, '0');

    return '#' + r1 + g1 + b1;
  }

  const a = opacity / 100;
  return `rgba(${r}, ${g}, ${b}, ${a})`;
}

function getName (...tokens: (string | number)[])
{
  return tokens.filter(e => e !== '').join('-');
}

export default function create ([k, child]: [string, string?], ns: string[])
{
  const fn = (hex: string, opacity: Opacity = 100) => ({
    selector: [getName(k, 'hex', hex, opacity), child],
    props: ns.map(n => `${n}: ${hexToValue(hex, opacity)}`),
  } as Property);

  fn.transparent = {
    selector: [getName(k, 'transparent'), child],
    props: ns.map(n => `${n}: transparent`),
  } as Property;

  fn.current = {
    selector: [getName(k, 'current'), child],
    props: ns.map(n => `${n}: currentColor`),
  } as Property;

  fn.black = (opacity: Opacity = 100) => ({
    selector: [getName(k, 'black', opacity), child],
    props: ns.map(n => `${n}: ${hexToValue('000000', opacity)}`),
  } as Property);

  fn.white = (opacity: Opacity = 100) => ({
    selector: [getName(k, 'white', opacity), child],
    props: ns.map(n => `${n}: ${hexToValue('ffffff', opacity)}`),
  } as Property);

  fn.hex = (hex: string, opacity: Opacity = 100) => ({
    selector: [getName(k, 'hex', hex, opacity), child],
    props: ns.map(n => `${n}: ${hexToValue(hex, opacity)}`),
  } as Property);

  fn.rgb = (r: number, g: number, b: number, opacity: Opacity = 100) => ({
    selector: [getName(k, 'rgb', r, g, b, opacity), child],
    props: ns.map(n => `${n}: ${rgbToValue(r, g, b, opacity)}`),
  } as Property);

  return fn;
}