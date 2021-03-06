/// <reference path="globals.d.ts" />
/// <reference path="manifest.d.ts" />
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
