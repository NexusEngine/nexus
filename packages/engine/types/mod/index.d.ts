/// <reference path="globals.d.ts" />
/// <reference path="manifest.d.ts" />
/// <reference path="object.d.ts" />
/// <reference path="events.d.ts" />
/// <reference path="functions.d.ts" />

/**
 * This interface represents the base game object
 * data shape.
 */
declare interface BaseShape<Type = any> {
  _id: Type
}

/**
 * Engine configuration.
 */
declare type Configuration = Record<string, any> & {
  /**
   * The shard name.
   * Used in distributed systems to namespace.
   */
  shard: string,
  /**
   * Enabled mods.
   * Mods listed here will be loaded on engine startup.
   */
  mods?: string[],
  /**
   * Configuration for the public API.
   */
  public: {
    /**
     * The path for the public API to listen on.
     */
    path: string,
  },
  /**
   * Storage configuration.
   */
  storage: {
    /**
     * Persistent storage configuration.
     */
    store: {
      /**
       * Path to persistent storage.
       */
      path: string,
    },
    /**
     * In-memory distributed storage configuration.
     */
    memory: {
      /**
       * Path to memory storage.
       */
      path: string,
    },
    /**
     * Stream configuration
     */
    stream: {
      /**
       * Path to stream storage.
       */
      path: string,
    }
  }
}

/**
 * Represents the context for an intent.
 * This object is passed as the first argument to game object intents.
 */
declare interface IntentContext {
  userId?: string,
}

/**
 * Represents a failed intent check.
 */
declare class IntentError extends Error {
  readonly code: string
  /**
   * Create a new intent error with the given error code and message.
   * @param code The error code, for programmatic use
   * @param message Optional error message
   */
  constructor(code: string, message?: string)
}

declare const Processors: unique symbol

/**
 * Represents a logger instance which logs to a file on the file system.
 */
declare class Logger {
  /**
   * Log a message to the log file.
   * @param message The message to log
   * @param out Whether to log the message to the console as well (default true)
   */
  log(message: string, out?: boolean): void

  /**
   * Log a warning message to the log file.
   * @param message The message to log
   * @param out Whether to log the message to the console as well (default true)
   */
  warn(message: string, out?: boolean): void

  /**
   * Log an error message to the log file.
   * @param message The message to log
   * @param out Whether to log the message to the console as well (default true)
   */
  error(message: string, out?: boolean): void

  /**
   * Write a message to the log file.
   * @param message The message to log
   * @param out Whether to log the message to the console as well (default true)
   */
  write(message: string): void

  /**
   * Transform the passed in message to the
   * message that will be written to the log file.
   * @param str The string to transform
   */
  transform(str: string): string
}
