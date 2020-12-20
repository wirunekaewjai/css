export interface Config {
    source: Source;
    module: Module;
    build: Build;
}
export interface Source {
    directory: string;
}
export interface Module {
    input: {
        extension: string;
    };
    output: {
        extension: string;
    };
}
export interface Build {
    directory: string;
    entries: Generic<string[]>;
}
export interface Generic<T> {
    [name: string]: T;
}
