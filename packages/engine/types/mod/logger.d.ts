import type { JsonValue } from 'type-fest'
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
    log(...args: JsonValue[]): void

    /**
     * Log a warning message.
     * @param message The message to log
     */
    warn(...args: JsonValue[]): void

    /**
     * Log an error message.
     * @param message The message to log
     */
    error(...args: JsonValue[]): void

    /**
     * Close the logger instance, rendering it useless.
     */
    close(): Promise<void>
  }
}
