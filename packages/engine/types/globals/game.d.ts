import type { JsonObject } from 'type-fest'
import type { JSONSchemaType } from 'ajv'

declare global {
  namespace Nexus {
    interface Game {
      /**
       * Register an event handler.
       * @param name The name of the event
       * @param handler The event handler
       */
      register<Key extends keyof Events.Game>(name: Key, handler: Events.Game[Key]): void
    }
  }

  /**
   * Intent configuration.
   */
  interface IntentConfig<Payload extends JsonObject> {
    /**
     * JSON Schema for payload validation
     */
    schema: JSONSchemaType<Payload>
  }

  interface IntentContext<Payload extends JsonObject> {
    payload: Payload,
  }

  /**
   * Registers the method as an intent and provides payload validation.
   * @param config Intent configuration
   */
  function intent<Payload extends JsonObject>(config: IntentConfig<Payload>): PropertyDecorator
}
