import type { Filter } from 'mongodb'
import type { Operation } from 'fast-json-patch'
import { MongoClient } from 'mongodb'
import { nanoid } from 'nanoid/async'
import { generateUpdateFilter } from './patch'

export class MongoStore implements Nexus.Store {
  #connected = false
  #client: MongoClient

  constructor(path: string) {
    this.#client = new MongoClient(path)
  }

  get connected() {
    return this.#connected
  }

  async connect() {
    if (!this.#connected) {
      await this.#client.connect()
      this.#connected = true
    }
    return this
  }

  async disconnect() {
    if (this.#connected) {
      await this.#client.close()
      this.#connected = false
    }
  }

  db(dbName?: string): MongoDatabase {
    return new MongoDatabase(this.#client, dbName)
  }
}

export class MongoDatabase implements Nexus.Database {
  #client: MongoClient
  readonly dbName: string | null

  constructor(client: MongoClient, dbName?: string) {
    this.#client = client
    this.dbName = dbName ?? null
  }

  collection<Shape extends BaseShape>(collectionName: string) {
    return new MongoCollection<Shape>(this.#client, this.dbName, collectionName)
  }
}

export class MongoCollection<Shape extends BaseShape> implements Nexus.Collection<Shape> {
  #client: MongoClient
  readonly dbName: string | null
  readonly collectionName: string

  constructor(client: MongoClient, dbName: string | null, collectionName: string) {
    this.#client = client
    this.dbName = dbName
    this.collectionName = collectionName
  }

  async findById(id: Shape['_id']) {
    return this.#client
      .db(this.dbName ?? undefined)
      .collection<Shape>(this.collectionName)
      .findOne({ _id: id }) as Promise<Shape | undefined>
  }

  async findOne(query: Filter<Shape>) {
    return this.#client
      .db(this.dbName ?? undefined)
      .collection<Shape>(this.collectionName)
      .findOne(query) as Promise<Shape | undefined>
  }

  async find(query: Filter<Shape>) {
    return this.#client
      .db(this.dbName ?? undefined)
      .collection<Shape>(this.collectionName)
      .find(query).toArray() as Promise<Shape[]>
  }

  async insert(data: Partial<Shape>) {
    const _id = await nanoid()
    return this.#client
      .db(this.dbName ?? undefined)
      .collection<Shape>(this.collectionName)
      .insertOne({ _id, ...data } as any)
  }

  async update(id: Shape['_id'], operations: Operation[]) {
    const filter = generateUpdateFilter<Shape>(operations)
    return (await this.#client
      .db(this.dbName ?? undefined)
      .collection<Shape>(this.collectionName)
      .updateOne({ _id: id }, filter)).modifiedCount ===  1
  }

  async delete(id: Shape['_id']) {
    return (await this.#client
      .db(this.dbName ?? undefined)
      .collection<Shape>(this.collectionName)
      .deleteOne({ _id: id })).deletedCount === 1
  }
}

Engine.register('preInitializer', () => {
  registerStore('mongodb:', path => new MongoStore(path))
})
