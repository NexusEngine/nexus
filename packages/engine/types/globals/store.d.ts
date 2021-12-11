declare namespace Nexus {
  interface Store extends BaseProvider {
    /**
     * Open a database. If no database name is given,
     * the default database is used.
     * @param dbName The name of the database to open
     */
    db(dbName?: string): Database
  }

  interface Database {
    /**
     * Open a collection.
     * @param collectionName The name of the collection
     */
    collection<Shape extends BaseShape>(collectionName: string): Collection<Shape>
  }

  interface Collection<Shape extends BaseShape> {
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
