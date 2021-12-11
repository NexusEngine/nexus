import type { JsonValue } from 'type-fest'
import { Writable } from 'stream'
import { createWriteStream } from 'fs'

/**
 * A simple file system logger.
 * Logs to a file on the file system.
 */
export class FileSystemLogger extends Writable implements Logger {
  readonly outFile: string
  #outStream?: ReturnType<typeof createWriteStream>

  constructor(outFile: string) {
    super({ objectMode: true })
    this.outFile = outFile
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
    if (this.#outStream) {
      await new Promise<void>(resolve => {
        this.#outStream!.end(() => {
          this.#outStream = undefined
          resolve()
        })
      })

      await new Promise<void>(resolve => this.end(resolve))
    }
  }

  _construct(done: (err?: Error) => void) {
    try {
      this.#outStream = createWriteStream(this.outFile, { flags: 'a' })
      done()
    } catch (err: any) {
      done(err)
    }
  }

  _write(chunk: JsonValue[], _encoding: BufferEncoding, done: (error?: Error | null) => void): void {
    chunk.unshift(new Date().toISOString())
    this.#outStream!.write(`${JSON.stringify(chunk)}\n`, done)
  }

  _destroy(_error: Error | null, done: (error?: Error | null) => void): void {
    this.#outStream!.end(done)
  }
}
