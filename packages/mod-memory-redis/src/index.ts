import Redis from 'ioredis'

export class MemoryRedis implements Nexus.Memory {
  #client: Redis.Redis

  constructor(path: string) {
    this.#client = new Redis(path, { lazyConnect: true })
  }

  async connect(): Promise<MemoryRedis> {
    await this.#client.connect()
    return this
  }

  async disconnect(): Promise<void> {
    this.#client.disconnect()
  }

  async set(key: string, value: string) {
    this.#client.set(key, value)
  }

  async get(key: string) {
    return this.#client.get(key) as Promise<string | undefined>
  }

  async del(...keys: string[]) {
    return this.#client.del(...keys)
  }

  async incr(key: string) {
    return this.#client.incr(key)
  }

  async incrBy(key: string, increment: number) {
    return this.#client.incrby(key, increment)
  }

  async decr(key: string) {
    return this.#client.decr(key)
  }

  async decrBy(key: string, increment: number) {
    return this.#client.decrby(key, increment)
  }

  async hexists(key: string, field: string) {
    return await this.#client.hexists(key, field) === 1
  }

  async hdel(key: string, ...fields: string[]) {
    return this.#client.hdel(key, ...fields)
  }

  async hkeys(key: string) {
    return this.#client.hkeys(key)
  }

  async hlen(key: string) {
    return this.#client.hlen(key)
  }

  async hset(key: string, values: Record<string, any>) {
    await this.#client.hset(key, values)
  }

  async hgetall(key: string) {
    return this.#client.hgetall(key)
  }

  async sadd(key: string, ...values: string[]) {
    await this.#client.sadd(key, ...values)
  }

  async scard(key: string) {
    return this.#client.scard(key)
  }

  async smembers(key: string) {
    return this.#client.smembers(key)
  }

  // @ts-expect-error
  async sismember(key: string, ...members: string[]) {
    if (members.length === 1) {
      return await this.#client.sismember(key, members[0]) === 1
    } else {
      return Promise.all(members.map(async member => {
        return await this.#client.sismember(key, member) === 1
      }))
    }
  }

  // @ts-expect-error
  async srandmember(key: string, count = 1) {
    if (count === 1) {
      return (await this.#client.srandmember(key, count))?.[0]
    } else {
      return await this.#client.srandmember(key, count)
    }
  }

  // @ts-expect-error
  async spop(key: string, count = 1) {
    if (count === 1) {
      return (await this.#client.spop(key, count))?.[0]
    } else {
      return await this.#client.spop(key, count)
    }
  }

  async smove(source: string, destination: string, member: string) {
    return await this.#client.smove(source, destination, member) === 1
  }

  async srem(key: string, ...members: string[]) {
    await this.#client.srem(key, ...members)
  }
}
