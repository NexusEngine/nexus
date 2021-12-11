import type { Writable } from 'stream'

declare global {
  /**
   * Represents a logger instance.
   */
  class Logger extends Writable {
    /**
     * Log a message.
     * @param message The message to log
     */
    log(message: string): void

    /**
     * Log a warning message.
     * @param message The message to log
     */
    warn(message: string): void

    /**
     * Log an error message.
     * @param message The message to log
     */
    error(message: string): void

    /**
     * Transform the passed in message to the
     * message that will be written to the stream.
     * @param str The string to transform
     */
    transform(str: string): string

    /**
     * Close the logger instance, rendering it useless.
     */
    close(): Promise<void>
  }
}
