import type { BaseShape, DataProvider, DataCollection, DataDatabase } from '@nexus-engine/engine'
import type { Db, Collection } from 'mongodb'
import type { Operation } from 'fast-json-patch'
import { MongoClient } from 'mongodb'
import { nanoid } from 'nanoid/async'
import { transform } from '../lib/transform.js'

export class DataProviderMongo implements DataProvider {
  #connected = false
  readonly client: MongoClient

  constructor(readonly path: string) {
    this.client = new MongoClient(path)
  }

  get connected() { return this.#connected }

  async connect() {
    if (this.#connected) {
      return
    }

    await this.client.connect()
    this.#connected = true
    this.client.on('close', () => this.#connected = false)
  }

  async disconnect() {
    if (!this.#connected) {
      return
    }

    await this.client.close()
    this.#connected = false
  }

  db(dbName?: string) {
    return new DataDatabaseMongo(this, dbName)
  }
}

class DataDatabaseMongo implements DataDatabase {
  #db: Db
  constructor(readonly provider: DataProviderMongo, readonly dbName: string | null = null) {
    this.#db = provider.client.db(dbName ?? undefined)
  }

  collection<Shape extends BaseShape = any>(collectionName: string) {
    return new DataCollectionMongo<Shape>(this.provider, this.#db, collectionName)
  }
}

class DataCollectionMongo<Shape extends BaseShape> implements DataCollection<Shape> {
  #collection: Collection<Shape>
  constructor(readonly provider: DataProviderMongo, readonly db: Db, readonly collectionName: string) {
    this.#collection = db.collection<Shape>(collectionName)
  }

  async insert(data: Partial<Shape>) {
    const _id = await nanoid()
    // @ts-expect-error
    return this.#collection.insertOne({ _id, ...data })
  }

  async update(id: Shape['_id'], operations: Operation[]): Promise<Shape['_id']> {
    return (await this.#collection.updateOne(id, transform(operations))).upsertedId
  }

  async delete(id: Shape['_id']) {
    return (await this.#collection.deleteOne({ _id: id })).deletedCount === 1
  }
}
