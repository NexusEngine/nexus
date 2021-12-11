declare namespace Nexus {
  interface Game {
    /**
     * Register an event handler.
     * @param name The name of the event
     * @param handler The event handler
     */
    register<Key extends keyof Events.Game>(name: Key, handler: Events.Game[Key]): void
  }
}
