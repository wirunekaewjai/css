import { readFileSync } from 'fs';
import removeComments from './remove-comments';

export default function fromFileSync (path: string)
{
  function getEntryName (text: string)
  {
    const names: string[] = [];

    text.replace(/^\s*\/\*\s*[A-Za-z0-9-_]+\s*\*\//, (c, i) =>
    {
      names.push(c.trim().slice(2, -2).trim());
      return c;
    });

    if (names.length > 0)
    {
      return names[0];
    }

    return undefined;
  }

  try
  {
    const src = readFileSync(path).toString('utf8');
    const entry = getEntryName(src);

    return {
      entry,
      default: removeComments(src),
    }
  }
  catch {
    return {
      entry: undefined,
      default: '',
    }
  }
}
