import fs from 'fs';
import { defaultConfigName } from '../consts';

export default function run ()
{
  const ext = fs.existsSync('tsconfig.json') ? '.ts' : '.js';
  const path = defaultConfigName + ext;

  if (fs.existsSync(path))
  {
    console.error(`config file "${path}" already exists`);
    return;
  }

  const template = require('./template');
  const text = template.default as string;

  fs.writeFileSync(path, text);

  console.error(`create config file "${path}" successfully`);
}