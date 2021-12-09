/**
 * Represents a base game object.
 * Game objects provide the logic for your game.
 * Almost anything can be a game object.
 */
declare abstract class GameObject<Shape extends BaseShape> {
  readonly ['#dbName']: string | null
  readonly ['#collectionName']: string
  ['#data']: Shape

  constructor(data: Shape)
  constructor(dbName: string | null, collectionName: string, data: Shape)
  constructor(dbOrData: Shape | string | null, collectionName?: string, data?: Shape)

  /**
   * The ID of the game object.
   */
  get id(): Shape['_id']

  /**
   * Flush the mutations to the shape to persistent storage.
   */
  flush(): Promise<void>

  /**
   * Revoke the shape observer proxy, preparing it for garbage collection.
   */
  revoke(): void

  /**
   * Flush mutations to persistent storage and revoke the observer proxy.
   */
  flushAndRevoke(): Promise<void>
}
