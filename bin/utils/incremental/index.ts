import toAscii from './to-ascii';
import { Generic } from '../../../css/types';

let ids: Generic<string> = {};
let increment = 0;

function reset ()
{
  ids = {};
  increment = 0;
}

function get (key: string)
{
  if (!ids[key])
  {
    ids[key] = toAscii(increment++);
  }

  return ids[key];
}

export default {
  reset,
  get,
}
