import type { Operation } from 'fast-json-patch'
import type { DataProvider, DataDatabase, DataCollection } from '../provider.js'
import type { BaseShape } from '../../game/object.js'
import { nanoid } from 'nanoid/async'

const dbMap = new Map<string, Map<string, Record<string, any>>>()

export class DataProviderMemory implements DataProvider {
  readonly connected = true
  readonly url: URL

  constructor(readonly path: string) {
    this.url = new URL(path)
  }

  async connect() {
    return this
  }

  async disconnect() {}

  db(dbName?: string) {
    return new DataDatabaseMemory(dbName ?? this.url.pathname)
  }
}

export class DataDatabaseMemory implements DataDatabase {
  constructor(readonly dbName: string) {
    if (!dbMap.has(dbName)) {
      dbMap.set(dbName, new Map())
    }
  }

  collection<Shape extends BaseShape>(collectionName: string) {
    return new DataCollectionMemory<Shape>(this.dbName, collectionName)
  }
}

export class DataCollectionMemory<Shape extends BaseShape> implements DataCollection<Shape> {
  constructor(readonly dbName: string, readonly collectionName: string) {}

  async insert(data: Partial<Shape>) {
    const db = dbMap.get(this.dbName)!
    const collection = db.get(this.collectionName) ?? {}
    const _id = await nanoid()
    collection[data['_id'] ?? _id] = { _id, ...data }
    db.set(this.dbName, collection)
  }

  async update(id: Shape['_id'], operations: Operation[]) {
    //
  }

  async delete(id: Shape['_id']) {
    const db = dbMap.get(this.dbName)!
    const collection = db.get(this.collectionName)
    if (!collection || !collection[id]) {
      return false
    }

    delete collection[id]
    return true
  }
}
