import { CSSConfigInput, CSSConfig, Screens } from './types';

export default function create (input?: CSSConfigInput)
{
  const exts = input?.extends;
  const out: CSSConfig = {
    source: {
      dir: input?.source.dir ?? 'src',
      ext: input?.source.ext ?? '.s.ts',
    },
    
    out: {
      classes: {
        ext: input?.out.classes?.ext ?? '.c.js',
      },

      css: {
        dir: input?.out.css?.dir ?? 'src',
        base: input?.out.css?.base ?? 'base.css',
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
    extends: {
      screens: parseScreens(exts?.screens ?? {}),

      font: {
        family: {
          sans: [exts?.font?.family?.sans ?? '', `ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"`].join(' ').trim(),
          serif: [exts?.font?.family?.serif ?? '', `ui-serif, Georgia, Cambria, "Times New Roman", Times, serif`].join(' ').trim(),
          mono: [exts?.font?.family?.mono ?? '', `ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace`].join(' ').trim(),
        },
      },
    },
  };

  return out;
}

function parseScreens (screens: Screens)
{
  const hasDefault = Object.values(screens).filter(n => n <= 0).length > 0;

  if (hasDefault)
  {
    return screens;
  }

  return { '$': -1, ...screens };
}