import css from '.';

interface Stylesheet {
  type: 'stylesheet';
  stylesheet: {
    rules: Array<Supports | Media | Rule>;
  };
}

interface Media {
  type: 'media';
  media: string;
  rules: Array<Supports | Media | Rule>;
}

interface Supports {
  type: 'supports';
  supports: string;
  rules: Array<Supports | Media | Rule>;
}

interface Rule {
  type: 'rule' | 'page';
  selectors: string[];
  declarations: Declaration[];
}

interface Declaration {
  type: 'declaration';
  property: string;
  value: string;
}

const src = css`

`;

const rework = require('rework');
const dst = rework(src).obj as Stylesheet;

console.log(JSON.stringify(dst, null, 2))