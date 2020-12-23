export const sm = 640;
export const md = 768;
export const lg = 1024;
export const xl = 1280;

const sizes = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
};

export default (name: keyof (typeof sizes)) =>
{
  return sizes[name];
}