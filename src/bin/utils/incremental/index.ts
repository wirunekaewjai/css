import digit from '../digit';
import { Increments } from './types';

class Incremental {
  ids: Increments = {};
  increment = 0;

  get (key: string)
  {
    const ids = this.ids;

    if (!ids[key])
    {
      ids[key] = digit.toAscii(this.increment++);
    }

    return ids[key];
  }
}

export default Incremental;