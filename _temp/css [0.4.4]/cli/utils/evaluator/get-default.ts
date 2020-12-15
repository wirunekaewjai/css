import { nanoid } from 'nanoid';

import path from 'path';
import fs from 'fs';

import getCode from './get-code';

export default function evaluate (file: string, externals?: string[])
{
  const code = getCode(file, externals);

  if (!code)
  {
    return undefined;
  }

  const moduleID = path.resolve(path.join('.', nanoid()));
  const modulePath = moduleID + '.js';

  fs.writeFileSync(modulePath, code);

  try
  {
    const module = require(moduleID);
    const data = module.default;

    fs.unlinkSync(modulePath);

    return data;
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
  
  