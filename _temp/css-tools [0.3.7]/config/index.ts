import {
  CSSConfigInput,
  CSSConfig,
} from './types';

export default function create (input?: CSSConfigInput)
{
  const out: CSSConfig = {
    source: {
      dir: input?.source.dir ?? 'src',
      exts: input?.source.exts ?? ['.scss'],
    },
    
    out: {
      classes: {
        ext: input?.out.classes?.ext ?? '.c.js',
      },

      css: {
        dir: input?.out.css?.dir ?? 'src',
        entries: input?.out.css?.entries ?? {},
      },
    },

    externals: Array.from(
      new Set([
        ...(input?.externals ?? []).filter(e => !!e),
  
        'react',
        'react-dom',
        'preact',
        'fs-events',
      ]),
    ),
  };

  return out;
}