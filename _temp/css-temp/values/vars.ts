
export function screen_size (breakpoint: string) {
  return `var(--screen-size-${breakpoint})` as `var(--screen-size-${string})`;
}

export function font_family (type: 'sans' | 'serif' | 'mono') {
  return `var(--font-${type})` as `var(--font-${string})`;
}