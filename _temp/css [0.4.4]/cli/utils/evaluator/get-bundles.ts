import getCode from './get-code';

export default function evaluate (file: string, externals?: string[])
{
  const code = getCode(file, externals);

  if (!code)
  {
    return [];
  }

  const paths: string[] = [];

  code.replace(/(\/\/\s).*(.ts|.js)/g, (a) =>
  {
    paths.push(a.slice(3));
    return a;
  });

  return paths;
}
  
  