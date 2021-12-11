import type { JsonValue } from 'type-fest'
import { Writable } from 'stream'
import Redis from 'ioredis'

export class RedisLogger extends Writable implements Logger {
  #client: Redis.Redis
  constructor(readonly url: string, readonly key = 'log') {
    super({ objectMode: true })
    this.#client = new Redis(url, {
      lazyConnect: true,
      keyPrefix: `${Engine.config.shard}:`,
    })
  }

  log(...args: JsonValue[]): void {
    this.write(args)
  }

  warn(...args: JsonValue[]): void {
    args.unshift('WARN')
    this.write(args)
  }

  error(...args: JsonValue[]): void {
    args.unshift('ERR')
    this.write(args)
  }

  async close() {
    this.#client.disconnect()
  }

  _construct(done: (error?: Error | null) => void) {
    try {
      this.#client.connect(done)
    } catch (err: any) {
      done(err)
    }
  }

  _destroy(_error: Error | null, callback: (error?: Error | null) => void): void {
    this.#client.disconnect()
    callback()
  }

  _write(args: any[], _encoding: BufferEncoding, callback: (error?: Error | null) => void): void {
    this.#client.xadd(this.key, '*', ...args)
      .then(() => callback())
      .catch(err => callback(err))
  }
}
