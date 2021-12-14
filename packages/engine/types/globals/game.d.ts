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

      /**
       * Register a game object with the game.
       * @param target The target object to register
       */
      registerObject<Target extends typeof GameObject>(target: Target): void
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

  interface IntentContext<Payload> {
    payload: Payload,
  }

  interface Intent {
    target: string,
    op: string,
    payload: JsonObject,
  }

  /**
   * Registers the method as an intent and provides payload validation.
   * @param config Intent configuration
   */
  function intent<Payload>(config: IntentConfig<Payload>): PropertyDecorator

  /**
   * The base game object class.
   * Almost anything can be a game object.
   * Game objects are persisted to the database.
   */
  abstract class GameObject<Shape extends BaseShape> {
    constructor(data: Shape)

    /**
     * Underlaying data shape.
     */
    '#data': Shape

    /**
     * The ID of the game object.
     */
    get id(): Shape['_id']

    /**
     * Flush pending patches to the database.
     */
    flush(): Promise<void>

    /**
     * Revoke the shape observer proxy.
     */
    revoke(): void

    /**
     * Flush pending patches and revoke the shape observer proxy.
     */
    flushAndRevoke(): Promise<void>
  }
}
