declare module 'mods' {
  global {
    type Provide = 'store'
      | 'memory'
      | 'stream'
      | 'game'
      | 'shard'
      | 'launcher'
      | 'processor'
      | 'public'

    interface Manifest {
      provides: Provide | Provide[] | null,
      paths?: Partial<Record<Provide, string>>
    }

    interface BaseShape<Type = any> {
      _id: Type
    }

    type Configuration = Record<string, any> & {
      shard: string,
      mods?: string[],
      public: {
        path: string,
      },
      storage: {
        store: {
          path: string,
        },
        memory: {
          path: string,
        },
        stream: {
          path: string,
        }
      }
    }

    abstract class GameObject<Shape extends BaseShape> {
      constructor(data: Shape)
      constructor(dbName: string | null, collectionName: string, data: Shape)
      constructor(dbOrData: Shape | string | null, collectionName?: string, data?: Shape)

      get id(): Shape['_id']
      flush(): Promise<void>
      revoke(): void
      flushAndRevoke(): Promise<void>
    }

    namespace Nexus {
      namespace Events {
        interface Engine {
          preInitializer: () => void
          postInitializer: () => void
        }

        interface Shard {
          /** Run on instance initialization. */
          environment(): void,
          /** Run when an instance has started up. */
          startup(id: string): void
          /** Run when the shutdown command is given. */
          shutdown(time: number): void
        }

        interface Game {
          // TODO
        }
      }

      interface Engine {
        register<Key extends keyof Events.Engine>(name: Key, handler: Events.Engine[Key]): void
        config: Configuration
      }

      interface Shard {
        register<Key extends keyof Events.Shard>(name: Key, handler: Events.Shard[Key]): void
      }

      interface Game {
        register<Key extends keyof Events.Game>(name: Key, handler: Events.Game[Key]): void
        registerObject<Target extends typeof GameObject>(target: Target, name?: string): void
      }

      interface Store {
        /**
         * Open a database. If no database name is given,
         * the default database is used.
         * @param dbName The name of the database to open
         */
        db(dbName?: string): Database
      }

      interface Database {
        /**
         * Open a collection.
         * @param collectionName The name of the collection
         */
        collection<Shape extends BaseShape>(collectionName: string): Collection<Shape>
      }

      interface Collection<Shape extends BaseShape> {
        /**
         * Find an object by its ID.
         * @param id The ID of the object
         * @returns The object, or undefined if no object is found
         */
        findById(id: Shape['_id']): Promise<Shape | undefined>
        /**
         * Find the first object that matches the given filter.
         * @param query The query filter
         * @returns The object, or undefined if no object is found
         */
        findOne(query: any): Promise<Shape | undefined>
        /**
         * Find all objects that match the given filter.
         * @param query The query filter
         * @returns An array of objects
         */
        find(query: any): Promise<Shape[]>
        /**
         * Insert a new object into the collection.
         * @param shape The shape to insert
         * @returns The ID of the object
         */
        insert(shape: Partial<Shape>): Promise<Shape['_id']>
        /**
         * Update the object.
         * @param id The ID of the object to update
         * @param operations The JSON Patch operations to apply
         * @returns `true` if the object has been updated, `false` otherwise
         */
        update(id: Shape['_id'], operations: any[]): Promise<boolean>
        /**
         * Delete the object.
         * @param id The ID of the object to delete
         * @returns `true` if the object has been deleted, `false` otherwise
         */
        delete(id: Shape['_id']): Promise<boolean>
      }

      interface Memory {
        /**
         * Set `key` to `value`.
         * @param key The key
         * @param value The value
         */
        set(key: string, value: string): Promise<void>,

        /**
         * Get the string value of the key.
         * @param key The key to get
         * @returns The value of the key
         */
        get(key: string): Promise<string | undefined>,

        /**
         * Delete one or more keys.
         * @param keys The keys to delete
         */
        del(...keys: string[]): Promise<number>,

        /**
         * Increment the value of the key by one.
         * @param key The key to increment
         * @returns The new value
         */
        incr(key: string): Promise<number>,

        /**
         * Increment the value of the key by `increment`.
         * @param key The key to increment
         * @param increment The amount to increment
         * @returns The new value
         */
        incrBy(key: string, increment: number): Promise<number>,

        /**
         * Decrement the value of the key by one.
         * @param key The key to decrement
         * @returns The new value
         */
        decr(key: string): Promise<number>,

        /**
         * Decrement the value of the key by `decrement`.
         * @param key The key to decrement
         * @param decrement The amount to decrement
         * @returns The new value
         */
        decrBy(key: string, decrement: number): Promise<number>,

        /**
         * Check if the given hash contains the given field.
         * @param key The key of the hash
         * @param field The field to check
         * @returns Whether of not the field exists in the hash
         */
        hexists(key: string, field: string): Promise<boolean>,

        /**
         * Delete the given fields from the hash.
         * @param key The key of the hash
         * @param fields The fields to delete
         * @returns The number of deleted fields
         */
        hdel(key: string, ...fields: string[]): Promise<number>,

        /**
         * Get all keys for the given hash.
         * @param key The key of the hash
         * @returns The keys
         */
        hkeys(key: string): Promise<string[] | undefined>,

        /**
         * Get the number of fields for the given hash.
         * @param key The key of the hash
         * @returns The length
         */
        hlen(key: string): Promise<number>,

        /**
         * Set the keys and fields for the given hash.
         * @param key The key of the hash
         * @param values The values to set
         */
        hset(key: string, values: Record<string, any>): Promise<void>,

        /**
         * Get all values for the given hash.
         * @param key The key of the hash
         * @returns An object containing key-value pairs
         */
        hgetall(key: string): Promise<Record<string, any>>,

        /**
         * Add one or more values to the given set.
         * @param key The key of the set
         * @param values The values to add
         */
        sadd(key: string, ...values: string[]): Promise<void>,

        /**
         * Get the cardinality (number of elements) of the given set.
         * @param key The key of the set
         * @returns The cardinality
         */
        scard(key: string): Promise<number>,

        /**
         * Get all members of the given set.
         * @param key The key of the set
         * @returns The members of the set
         */
        smembers(key: string): Promise<string[]>,

        /**
         * Check if each member is a member of the given set.
         * @param key The key of the set
         * @param members The members to check
         * @returns Whether or not the members are members of the given set
         */
        sismember(key: string, ...members: string[]): Promise<boolean[]>,

        srandmember(key: string): Promise<string | undefined>,
        srandmember(key: string, count: number): Promise<string[] | undefined>,
        /**
         * Get one or up to `count` number of random members from the given set.
         * @param key The key of the set
         * @param count Optional count
         * @returns A random member, or an array of random members
         */
        srandmember(key: string, count?: number): Promise<string | string[] | undefined>,

        spop(key: string): Promise<string | undefined>,
        spop(key: string, count: number): Promise<string[] | undefined>,
        /**
         * Get one or up to `count` random members from the given set and remove them.
         * @param key The key of the set
         * @param count Optional count
         * @returns The popped members
         */
        spop(key: string, count?: number): Promise<string | string[] | undefined>,

        /**
         * Move a member from the source set to the destination set.
         * @param source The source set
         * @param destination The destination set
         * @param member The member to move
         * @returns Whether or not the member was moved
         */
        smove(source: string, destination: string, member: string): Promise<boolean>,

        /**
         * Remove one or more members from the given set.
         * @param key The key of the set
         * @param members The members to remove
         */
        srem(key: string, ...members: string[]): Promise<void>,
      }

      interface Stream {
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

    var Engine: Nexus.Engine
    var Shard: Nexus.Shard
    var Game: Nexus.Game
    var Store: Nexus.Store
    var Memory: Nexus.Memory
    var Stream: Nexus.Stream

    var registerMemory: (protocol: string, factory: (path: string) => Nexus.Memory) => void
    var buildMemory: (path: string) => Nexus.Memory

    /**
     * Register a `Store` provider with the given protocol.
     * @param protocol The provider protocol
     * @param factory The factory method
     */
    var registerStore: (protocol: string, factory: (path: string) => Nexus.Store) => void

    /**
     * Build a store for the given path.
     * @param path The path
     */
    var buildStore: (path: string) => Nexus.Store

    var registerStream: (protocol: string, factory: (path: string) => Nexus.Stream) => void
    var buildStream: (path: string) => Nexus.Stream
  }
}
