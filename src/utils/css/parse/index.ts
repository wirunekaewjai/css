import { Stylesheet } from './types';

export default function parse (css: string): Stylesheet
{
  const rework = require('rework');
  const dst = rework(css).obj as Stylesheet;

  return dst;
}