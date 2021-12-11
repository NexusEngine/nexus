import { Writable } from 'stream'
import Redis from 'ioredis'

export class RedisLogger extends Writable implements Logger {
  #client: Redis.Redis
  constructor(readonly url: string) {
    super()
    this.#client = new Redis(url, {
      lazyConnect: true,
      keyPrefix: `${Engine.config.shard}`,
    })
  }

  log(message: string): void {
    this.write(message)
  }

  warn(message: string): void {
    this.write(`(WARN) ${message}`)
  }

  error(message: string): void {
    this.write(`(ERR) ${message}`)
  }

  async close() {
    this.#client.disconnect()
  }

  _construct(done: (error?: Error | null) => void) {
    this.#client.connect(done)
  }

  _destroy(_error: Error | null, callback: (error?: Error | null) => void): void {
    this.#client.disconnect()
    callback()
  }

  _write(chunk: any, _encoding: BufferEncoding, callback: (error?: Error | null) => void): void {
    this.#client.xadd('log', '*', 'message', Buffer.isBuffer(chunk) ? chunk.toString('utf-8') : chunk as string).finally(callback)
  }

  transform(str: string): string {
    return `[${new Date().toLocaleString()}]: ${str}`
  }
}
