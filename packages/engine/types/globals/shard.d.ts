declare namespace Nexus {
  interface Shard {
    /**
     * Register an event handler.
     * @param name The name of the event
     * @param handler The event handler
     */
    register<Key extends keyof Events.Shard>(name: Key, handler: Events.Shard[Key]): void
  }
}
