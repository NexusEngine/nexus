import { EventEmitter } from 'events'
import { Redis } from 'ioredis'
import { array2object, Deferred, immediate, wait } from '.'

export interface StreamsReaderOptions {
  count?: number,
  blockingTimeout?: number,
}

export class StreamsReader {
  #connection: Redis
  #opts: Required<StreamsReaderOptions>
  #streams = new Map<string, string>()
  #streamListenerCount = new Map<string, number>()
  #streamEmitter = new EventEmitter()
  #reading = false

  public constructor(blockingConnection: Redis, opts: StreamsReaderOptions = {}) {
    this.#connection = blockingConnection
    this.#opts = {
      count: 5,
      blockingTimeout: 5000,
      ...opts,
    }
  }

  public async* read<T extends Record<string, string> = Record<string, string>>(key: string, { id = '$', signal }: {
    id?: string,
    signal?: AbortSignal,
  } = {}): AsyncIterableIterator<[string, T]> {
    let run = true
    let deferred = new Deferred<[string, T]>()

    if (signal) {
      signal.addEventListener('abort', () => {
        run = false

        if (deferred) {
          deferred.reject(new Error('aborted'))
        }
      }, { once: true })
    }

    if (!this.#streams.has(key)) {
      this.#streams.set(key, id)
    }

    this.#streamListenerCount.set(key, (this.#streamListenerCount.get(key) ?? 0) + 1)

    const listener = (id: string, props: T) => {
      deferred.resolve([id, props])
      deferred = new Deferred()
    }

    this.#streamEmitter.on(key, listener)

    if (!this.#reading) {
      this.#read().catch(err => console.error(err))
    }

    const cleanup = () => {
      this.#streamEmitter.removeListener(key, listener)
      this.#streamListenerCount.set(key, this.#streamListenerCount.get(key)! - 1)

      // Remove stream if this was the last listener
      if (this.#streamListenerCount.get(key) === 0) {
        this.#streams.delete(key)
        this.#streamListenerCount.delete(key)
      }
    }

    while (run) {
      try {
        yield await deferred.promise
      } catch (err: any) {
        if (err.message !== 'aborted') {
          cleanup()
          throw err
        }
      }
    }

    cleanup()
  }

  async #read(): Promise<void> {
    if (this.#reading) return
    this.#reading = true

    while (this.#streams.size > 0) {
      const keys = [...this.#streams.keys()]
      const ids = [...this.#streams.values()]

      try {
        const results = await this.#connection.xread(
          'COUNT', this.#opts.count,
          'BLOCK', this.#opts.blockingTimeout,
          'STREAMS', ...keys, ...ids,
        )

        for (const stream of results) {
          const key = stream[0]
          const entries = stream[1]

          if (!entries.length) {
            continue
          }

          if (!this.#streams.has(key)) {
            // the stream has been removed
            // don't emit the remaining entries
            continue
          }

          let lastId: string

          for (const entry of entries) {
            const id = lastId = entry[0]
            const props = array2object(entry[1])
            this.#streamEmitter.emit(key, id, props)
            await immediate()
          }

          this.#streams.set(key, lastId!)
        }
      } catch (err: any) {
        if (err.message !== 'Connection is closed.') {
          this.#reading = false
          throw err
        }

        await wait(this.#opts.blockingTimeout)
      }
    }

    this.#reading = false
  }
}
