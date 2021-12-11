declare namespace Nexus {
  interface Engine {
    /**
     * Register an event handler.
     * @param name The name of the event
     * @param handler The event handler
     */
    register<Key extends keyof Events.Engine>(name: Key, handler: Events.Engine[Key]): void

    /**
     * Engine configuration
     */
    config: Configuration
  }
}
