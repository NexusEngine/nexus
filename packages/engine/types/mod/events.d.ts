declare namespace Nexus {
  /**
   * Contains all events the engine produces.
   */
  namespace Events {
    /**
     * Events produced by the engine instance.
     */
    interface Engine {
      /**
       * Run after mod manifests have been imported
       * but before the storage providers are registered.
       */
      preInitializer: () => void

      /**
       * Run after storage providers are registered.
       */
      postInitializer: () => void

      /**
       * Run after storage providers have connected.
       */
      preService(): void
    }

    /**
     * Events produced by the shard.
     */
    interface Shard {
      /**
       * Run when the engine instance is first initialized.
       */
      environment: () => void

      /**
       * Run on shard startup.
       */
      startup: () => void

      /**
       * Run when the shard shutdown command has been given
       * @param time The time when the shard must shut down
       */
      shutdown: (time: number) => void
    }

    /**
     * Events produced by the game
     */
    interface Game {
      // TODO
    }
  }
}
