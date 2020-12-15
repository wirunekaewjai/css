const color = 'green';

function background_attachment (type: 'fixed' | 'local' | 'scroll')
{
  return [`background-attachment: ${type}`];
}

type CSS = {
  [name: string]: CSSClass[];
};

type CSSClass = {
  variants: {
    sizes: string[];
    pseudos?: string[];
  };

  styles: CSSStyle[];
};

type CSSStyle = CSSParentStyle | CSSLeafStyle;
type CSSParentStyle = { [child: string]: CSSLeafStyle };
type CSSLeafStyle = string | string[];

export default {
  container: [
    {
      variants: {
        sizes: ['xs', 'md'],
        pseudos: ['hover', 'active'],
      },
      styles: [
        `background-color: red`,
        `color: ${color}`,

        background_attachment('fixed'),

        {
          '> * + *': [
            `font-size: 10rem`,
          ],
          '> *': [

          ],
        },
      ],
    }
  ],
} as CSS;