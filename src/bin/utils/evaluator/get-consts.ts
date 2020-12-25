import { nanoid } from 'nanoid';

import path from 'path';
import fs from 'fs';

import getCode from './get-code';

export default function evaluate<T> (file: string, fields: string[], externals?: string[]): T | undefined
{
  const code = getCode(file, externals);

  if (!code)
  {
    return undefined;
  }

  const moduleID = path.resolve(path.join('.', 'esm_' + nanoid(6) + '.wktmp'));
  const modulePath = moduleID + '.js';

  fs.writeFileSync(modulePath, code);

  try
  {
    const module = require(moduleID);
    const obj: any = {};

    for (const field of fields)
    {
      obj[field] = module[field];
    }

    fs.unlinkSync(modulePath);

    return obj;
  }
  catch (err)
  {
    console.error(err);

    if (fs.existsSync(modulePath))
    {
      fs.unlinkSync(modulePath);
    }
  }

  return undefined;
}
  
  