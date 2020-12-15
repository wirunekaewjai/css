import { Property } from '../types/property';
import { Color } from '../types/color';
import { Global } from '../types/global';
import { LengthPercentage } from '../types/length-percentage';
import {
  TextDecorationLine,
  TextDecorationStyle,
  TextDecorationThickness,
} from '../types/text-decoration';

type Sh1 = [TextDecorationLine];
type Sh2 = [TextDecorationLine, TextDecorationStyle];
type Sh3 = [TextDecorationLine, TextDecorationStyle, Color];
type Sh4 = [TextDecorationLine, Color];

type Sh5 = [TextDecorationLine, TextDecorationLine];
type Sh6 = [TextDecorationLine, TextDecorationLine, TextDecorationStyle];
type Sh7 = [TextDecorationLine, TextDecorationLine, TextDecorationStyle, Color];
type Sh8 = [TextDecorationLine, TextDecorationLine, Color];

type Sh9 = [TextDecorationLine, TextDecorationLine, TextDecorationLine];
type Sh10 = [TextDecorationLine, TextDecorationLine, TextDecorationLine, TextDecorationStyle];
type Sh11 = [TextDecorationLine, TextDecorationLine, TextDecorationLine, TextDecorationStyle, Color];
type Sh12 = [TextDecorationLine, TextDecorationLine, TextDecorationLine, Color];

type Sh = Sh1 | Sh2 | Sh3 | Sh4 | Sh5 | Sh6 | Sh7 | Sh8 | Sh9 | Sh10 | Sh11 | Sh12;

export function text_decoration (...decor: Sh): Property
{
  return {
    items: [`text-decoration: ${decor}`],
  }
}

export function text_decoration_line (...line: [TextDecorationLine, TextDecorationLine?, TextDecorationLine?]): Property
{
  const l = line.filter(e => !!e).join(' ');

  return {
    items: [`text-decoration-line: ${l}`],
  }
}

export function text_decoration_style (style: TextDecorationStyle | Global): Property
{
  return {
    items: [`text-decoration-style: ${style}`],
  }
}

export function text_decoration_color (color: Color | Global): Property
{
  return {
    items: [`text-decoration-color: ${color}`],
  }
}

export function text_decoration_thickness (thickness: LengthPercentage | TextDecorationThickness | Global): Property
{
  return {
    items: [`text-decoration-thickness: ${thickness}`],
  }
}