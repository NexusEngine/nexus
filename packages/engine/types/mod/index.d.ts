/// <reference path="globals.d.ts" />
/// <reference path="manifest.d.ts" />
/// <reference path="object.d.ts" />
/// <reference path="events.d.ts" />
/// <reference path="functions.d.ts" />

declare module 'mods' {
  global {
    /**
     * This interface represents the base game object
     * data shape.
     */
    interface BaseShape<Type = any> {
      _id: Type
    }

    /**
     * Engine configuration.
     */
    type Configuration = Record<string, any> & {
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
    export interface IntentContext {
      userId?: string,
    }

    /**
     * Represents a failed intent check.
     */
    class IntentError extends Error {
      readonly code: string
      /**
       * Create a new intent error with the given error code and message.
       * @param code The error code, for programmatic use
       * @param message Optional error message
       */
      constructor(code: string, message?: string)
    }

    /**
     * Generate a unique, secure alphanumeric string.
     * @param size The length of the string (default 21)
     */
    function generateId(size?: number): Promise<string>

    /**
     * Chain multiple intent checks together.
     * @param checks The intent checks
     */
    function chainIntentChecks(...checks: (() => Promise<void>)[]): Promise<void>
  }
}