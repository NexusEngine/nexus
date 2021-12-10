import Redis from 'ioredis'
import { StreamsReader } from './util/reader'
import { array2object } from './util'

export class StreamRedis implements Nexus.Stream {
  #client: Redis.Redis
  #connected = false
  #manager?: StreamsReader

  constructor(path: string) {
    this.#client = new Redis(path, {
      lazyConnect: true,
      keyPrefix: `${Engine.config.shard}:`,
    })
  }

  get connected() {
    return this.#connected
  }

  async connect(): Promise<this> {
    if (!this.#connected) {
      await this.#client.connect()
      this.#connected = true
      this.#manager = new StreamsReader(this.#client.duplicate())
    }
    return this
  }

  async disconnect(): Promise<void> {
    if (this.#connected) {
      this.#client.disconnect()
      this.#connected = false
    }
  }

  async xadd<Type extends Record<string, any>>(key: string, id: string, values: Type) {
    const members = Object.keys(values).flatMap(key => [key, values[key]])
    this.#client.xadd(key, id, ...members)
  }

  async xlen(key: string) {
    return this.#client.xlen(key)
  }

  async xtrim(key: string, type: 'MAXLEN' | 'MINID', threshold: number | string) {
    return this.#client.xtrim(key, type, threshold)
  }

  async xdel(key: string, ...ids: string[]) {
    return this.#client.xdel(key, ...ids)
  }

  async* xrange<Type extends Record<string, any>>(key: string, start = '-', end: '+', count = 1): AsyncIterableIterator<[string, Type]> {
    for (const item of await this.#client.xrange(key, start, end, count)) {
      const entry = array2object(item[1])
      yield [item[0], entry]
    }
  }

  async* xrevrange<Type extends Record<string, any>>(key: string, end: '-', start: '+', count = 1): AsyncIterableIterator<[string, Type]> {
    for (const item of await this.#client.xrevrange(key, start, end, count)) {
      const entry = array2object(item[1])
      yield [item[0], entry]
    }
  }

  async* xread<Type extends Record<string, any>>(key: string, opts?: {
    id?: string,
    signal?: AbortSignal,
  }): AsyncIterableIterator<[string, Type]> {
    if (!this.#manager) {
      throw new Error('Stream manager not initialized. Are you connected?')
    }

    return this.#manager.read(key, opts)
  }
}

Engine.register('preInitializer', () => {
  registerStream('redis:', path => new StreamRedis(path))
})
