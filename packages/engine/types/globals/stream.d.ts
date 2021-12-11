declare namespace Nexus {
  interface Stream extends BaseProvider {
    /**
     * Add an entry to the given stream.
     * @param key The stream key
     * @param id The entry ID
     * @param values An object containing key-value pairs
     */
    xadd<Type extends Record<string, any>>(key: string, id: string, values: Type): Promise<void>,

    /**
     * Get the number of entries in the given stream.
     * @param key The stream key
     * @returns The number of entries in the given stream
     */
    xlen(key: string): Promise<number>,

    xtrim(key: string, type: 'MAXLEN', threshold: number): Promise<number>,
    xtrim(key: string, type: 'MINID', threshold: string): Promise<number>,
    /**
     * Trim the stream.
     * @param key The stream key
     * @param type The trim strategy
     * @param threshold A number if type is `MAXLEN`, a string if type if `MINID`
     */
    xtrim(key: string, type: 'MAXLEN' | 'MINID', threshold: number | string): Promise<number>,

    /**
     * Delete one or more entries from the given stream.
     * @param key The stream key
     * @param ids The entry IDs to delete
     */
    xdel(key: string, ...ids: string[]): Promise<number>,

    /**
     * Get stream entries in the given range.
     * @param key The stream key
     * @param start The start ID. If none is given, uses the special ``
     * @param end The end ID. If none is given, uses the special ``
     * @param count Optional count to return
     */
    xrange<Type extends Record<string, any>>(key: string, start?: string, end?: string, count?: number): AsyncIterableIterator<[string, Type]>

    /**
     * Get stream entries in the given range.
     * This is the inverted version of `xrange`.
     * @param key The stream key
     * @param start The start ID. If none is given, uses the special ``
     * @param end The end ID. If none is given, uses the special ``
     * @param count Optional count to return
     */
    xrevrange<Type extends Record<string, any>>(key: string, start?: string, end?: string, count?: number): AsyncIterableIterator<[string, Type]>

    /**
     * Read from the given stream.
     * @param key The stream key
     * @param opts Additional options
     * @param opts.id The ID to start reading from
     * @param opts.signal The abort signal
     * @returns An async iterable iterator
     */
    xread<Type extends Record<string, any>>(key: string, opts?: {
      id?: string,
      signal?: AbortSignal,
    }): AsyncIterableIterator<[string, Type]>
  }
}
