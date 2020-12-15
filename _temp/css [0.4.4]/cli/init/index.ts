import fs from 'fs';
import { defaultConfig } from '../consts';

export default function run ()
{
  const path = defaultConfig;

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