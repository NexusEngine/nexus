import { hooks } from '../engine/symbols'
import { registerGlobal } from '../utility/global'

export namespace Nexus {
  export interface Store {
    /**
     * Open a database. If no database name is given,
     * the default database is used.
     * @param dbName The name of the database to open
     */
    db(dbName?: string): Database
  }

  export interface Database {
    /**
     * Open a collection.
     * @param collectionName The name of the collection
     */
    collection<Shape extends BaseShape>(collectionName: string): Collection<Shape>
  }

  export interface Collection<Shape extends BaseShape> {
    /**
     * Find an object by its ID.
     * @param id The ID of the object
     * @returns The object, or undefined if no object is found
     */
    findById(id: Shape['_id']): Promise<Shape | undefined>
    /**
     * Find the first object that matches the given filter.
     * @param query The query filter
     * @returns The object, or undefined if no object is found
     */
    findOne(query: any): Promise<Shape | undefined>
    /**
     * Find all objects that match the given filter.
     * @param query The query filter
     * @returns An array of objects
     */
    find(query: any): Promise<Shape[]>
    /**
     * Insert a new object into the collection.
     * @param shape The shape to insert
     * @returns The ID of the object
     */
    insert(shape: Partial<Shape>): Promise<Shape['_id']>
    /**
     * Update the object.
     * @param id The ID of the object to update
     * @param operations The JSON Patch operations to apply
     * @returns `true` if the object has been updated, `false` otherwise
     */
    update(id: Shape['_id'], operations: any[]): Promise<boolean>
    /**
     * Delete the object.
     * @param id The ID of the object to delete
     * @returns `true` if the object has been deleted, `false` otherwise
     */
    delete(id: Shape['_id']): Promise<boolean>
  }
}

declare global {
  /**
   * Contains all methods for working with persistent storage.
   */
  var Store: Nexus.Store

  /**
   * Register a `Store` provider with the given protocol.
   * @param protocol The provider protocol
   * @param factory The factory method
   */
  var registerStore: (protocol: string, factory: (path: string) => Nexus.Store) => void

  /**
   * Build a store for the given path.
   * @param path The path
   */
  var buildStore: (path: string) => Nexus.Store
}

const providersMap = new Map<string, (path: string) => Nexus.Store>()

function registerStore(protocol: string, factory: (path: string) => Nexus.Store) {
  if (providersMap.has(protocol)) {
    throw new Error(`Store provider with protocol "${protocol}" already registered`)
  }
  providersMap.set(protocol, factory)
}

function buildStore(path: string) {
  const url = new URL(path)
  const factory = providersMap.get(url.protocol)
  if (!factory) {
    throw new Error(`No store provider for protocol "${url.protocol}"`)
  }
  return factory(path)
}

registerGlobal(registerStore)
registerGlobal(buildStore)

hooks.register('postInitializer', config => {
  registerGlobal('Store', buildStore(config.storage.store.path))
})
