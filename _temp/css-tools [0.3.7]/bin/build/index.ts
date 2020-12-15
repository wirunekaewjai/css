import fs from 'fs';

import evaluator from '../utils/evaluator';
import compiler from '../utils/compiler';

import { fallbackConfigs } from '../consts';

interface Args {
  config?: string;
}

function getPath (args: Args)
{
  const paths = args.config ? [args.config, ...fallbackConfigs] : fallbackConfigs;

  for (const path of paths)
  {
    if (fs.existsSync(path))
    {
      return path;
    }
  }

  return undefined;
}

export default function run (args: Args)
{
  const configFilePath = getPath(args);

  if (!configFilePath)
  {
    console.error('config file not founded');
    process.exit(1);
  }
  else
  {
    const config = evaluator.getConst(configFilePath, 'default');

    compiler.init(config);
    compiler.build();
  }
}