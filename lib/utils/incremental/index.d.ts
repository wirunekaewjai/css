import { Increments } from './types';
declare class Incremental {
    ids: Increments;
    increment: number;
    get(key: string): string;
}
export default Incremental;
