import { hooks, registerGlobal } from '../game/symbols'

export namespace Nexus {
  export interface Memory {
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
}

declare global {
  var Memory: Nexus.Memory

  var registerMemory: (protocol: string, factory: (path: string) => Nexus.Memory) => void
  var buildMemory: (path: string) => Nexus.Memory
}

const providersMap = new Map<string, (path: string) => Nexus.Memory>()

function registerMemory(protocol: string, factory: (path: string) => Nexus.Memory) {
  if (providersMap.has(protocol)) {
    throw new Error(`Memory provider with protocol "${protocol}" already registered`)
  }
  providersMap.set(protocol, factory)
}

function buildMemory(path: string) {
  const url = new URL(path)
  const factory = providersMap.get(url.protocol)
  if (!factory) {
    throw new Error(`No memory provider for protocol "${url.protocol}"`)
  }
  return factory(path)
}

registerGlobal(registerMemory)
registerGlobal(buildMemory)

hooks.register('postInitializer', config => {
  registerGlobal('Memory', buildMemory(config.storage.store.path))
})
