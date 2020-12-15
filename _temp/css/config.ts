import { CSSConfigInput, CSSConfig } from './types/config';

export function create (input?: CSSConfigInput)
{
  const exts = input?.extends;
  const out: CSSConfig = {
    source: {
      dir: input?.source.dir ?? 'src',
      ext: input?.source.ext ?? '.s.ts',
    },
    
    out: {
      classes: {
        ext: input?.out.classes?.ext ?? '.c.ts',
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
      ])
    ),
    extends: {
      breakpoints: exts?.breakpoints ?? {},
      // palette: exts?.palette ?? {},

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