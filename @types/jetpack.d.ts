declare module 'fs-jetpack' {
    function list(path: string): string[]
    function listAsync(path: string): Promise<string[]>
    function read(path: string, returnAs?: returnAs): any
    function readAsync(path: string, returnAs?: returnAs): Promise<any>
    function write(path: string, data: string | Buffer | object | any[], options?: writeOptions): void
    function writeAsync(path: string, data: string | Buffer | object | any[], options?: writeOptions): Promise<void>
}

type returnAs = 'utf8' | 'buffer' | 'json' | 'jsonWithDates';

type writeOptions = {
    atomic: boolean,
    jsonIndent: number,
};