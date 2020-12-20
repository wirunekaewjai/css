import { Hashmap } from './types';
declare class Hashes {
    map: Hashmap;
    hasChanged(filePath: string): boolean;
    setChanged(filePath: string): void;
}
export default Hashes;
