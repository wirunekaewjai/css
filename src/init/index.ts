import fs from 'fs';

export default function run ()
{
  const path = 'wkcss.config.ts';

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