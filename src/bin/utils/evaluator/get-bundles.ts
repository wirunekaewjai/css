import { existsSync } from 'fs';
import getCode from './get-code';

function getActualPath (filePath: string)
{
  const exts = ['.ts', '.js'];

  for (const ext of exts)
  {
    if (filePath.endsWith(ext))
    {
      if (existsSync(filePath))
      {
        return filePath;
      }

      const filePathX = filePath + 'x';

      if (existsSync(filePathX))
      {
        return filePathX;
      }

      return undefined;
    }
  }

  return filePath;
}

export default function evaluate (file: string, externals?: string[])
{
  const code = getCode(file, externals);

  if (!code)
  {
    return [];
  }

  const paths: string[] = [];

  code.replace(/(\/\/\s).*(.ts|.js|.tsx|.jsx)/g, (a) =>
  {
    paths.push(a.slice(3));
    return a;
  });

  return paths.map(e => getActualPath(e)).filter(e => typeof e === 'string' && e?.length > 0) as string[];
}
  
  