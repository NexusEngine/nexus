import { Writable } from 'stream'
import { createWriteStream } from 'fs'

export class Logger extends Writable {
  readonly outFile: string
  #lastOutput?: number
  #outStream?: ReturnType<typeof createWriteStream>

  constructor(outFile: string) {
    super()
    this.outFile = outFile
  }

  log(message: string, out = true): void {
    this.write(`(LOG) ${message}`)
    if (out) {
      console.log(message)
    }
  }

  warn(message: string, out = true): void {
    this.write(`(WARN) ${message}`)
    if (out) {
      console.warn(message)
    }
  }

  error(message: string, out = true): void {
    this.write(`(ERR) ${message}`)
    if (out) {
      console.error(message)
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

  _write(chunk: any, _encoding: BufferEncoding, done: (error?: Error | null) => void): void {
    const str = Buffer.isBuffer(chunk) ? chunk.toString('utf-8') : chunk
    const line = this.transform(str)
    this.#outStream!.write(line, done)
  }

  _destroy(_error: Error | null, done: (error?: Error | null) => void): void {
    this.#outStream!.end(done)
  }

  transform(str: string): string {
    const delta = Date.now() - (this.#lastOutput ?? Date.now())
    this.#lastOutput = Date.now()
    return `[${new Date().toLocaleString()}]: ${str} (+${delta}ms)\n`
  }
}
