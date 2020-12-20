import fs from 'fs';

import * as hasha from 'hasha';
import { Hashmap } from './types';

class Hashes {
  map: Hashmap = {};

  // init ()
  // {
  //   for (const filePath in this.map)
  //   {
  //     this.setChanged(filePath);
  //   }
  // }

  hasChanged (filePath: string)
  {
    if (!fs.existsSync(filePath))
    {
      return false;
    }

    if (!this.map[filePath])
    {
      return true;
    }

    const hash = hasha.fromFileSync(filePath, { algorithm: 'sha1' }) ?? '';
    return this.map[filePath] !== hash;
  }

  setChanged (filePath: string)
  {
    if (!fs.existsSync(filePath) && this.map[filePath])
    {
      delete this.map[filePath];
    }

    if (fs.existsSync(filePath))
    {
      const hash = hasha.fromFileSync(filePath, { algorithm: 'sha1' });

      if (hash)
      {
        this.map[filePath] = hash;
      }
    }
  }
}

export default Hashes;