import type { Observer, Operation } from 'fast-json-patch'
import { observe, generate } from 'fast-json-patch'

/**
 * Represents the base shape for game objects.
 */
export interface BaseShape<Type = any> {
  _id: Type,
}

/**
 * Represents the abstract game object which can be extended
 * by your own game objects.
 *
 * @example
 * class MyGameObject extends GameObject<MyGameObjectShape> {
 *  // ...
 * }
 */
export abstract class GameObject<Shape extends BaseShape> {
  /**
   * The name of the database to store this object in.
   * If the name is `null`, the default database will be used.
   */
  readonly ['#dbName']: string | null

  /**
   * The name of the collection to store this object in.
   * If the name is `null`, the default collection `game-objects` will be used.
   */
  readonly ['#collectionName']: string

  /**
   * The underlying data structure that represents this object.
   */
  ['#data']: Shape

  /**
   * The data observer generates JSON patches for each mutation
   * to the underlying data structure.
   */
  ['#observer']: Observer<Shape>

  /**
   * Unprocessed JSON patches.
   */
  ['#operations']: Operation[] = []

  /**
   * Instantiate the game object with the given properties.
   * @param dbName The database name. If `null`, the default database will be used
   * @param collectionName The collection name. If `null`, the default collection will be used
   * @param data The data which represents this object
   */
  constructor(dbName: string | null, collectionName: string | null, data: Shape) {
    this['#dbName'] = dbName
    this['#collectionName'] = collectionName ?? 'game-objects'
    this['#data'] = data
    this['#observer'] = observe(data, patches => this['#operations'].push(...patches))
  }

  /**
   * Get the number of pending (not flushed) patch operations.
   */
  get ['#pendingOperations']() { return this['#operations'].length }

  /**
   * The unique identifier for this object.
   */
  get id() { return this['#data']._id }

  /**
   * Flush the currently pending patches to storage.
   */
  async flush() {
    generate(this['#observer'])
    // TODO: Actually add patches to persistent storage
  }

  /**
   * Stop observing the object shape.
   */
  unobserve() {
    this['#observer'].unobserve()
  }

  /**
   * Flush the currently pending patches to storage
   * and stop observing the object shape.
   */
  async flushAndUnobserve() {
    await this.flush()
    this.unobserve()
  }
}
