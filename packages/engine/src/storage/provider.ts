import type { Operation } from 'fast-json-patch'
import type { BaseShape } from '../objects/GameObject.js'
import config from '../config'

export type Dispositions = 'data' | 'keyval' | 'stream' | 'pubsub'

export interface BaseProvider {
  connected: boolean
  connect(): Promise<void>
  disconnect(): Promise<void>
}

/**
 * Persisent storage provider interface.
 */
export interface DataProvider extends BaseProvider {
  /**
   * Open a database. If no database name is given,
   * uses the default database (i.e. the one in the path).
   * @param dbName The name of the database to open
   */
  db(dbName?: string): DataDatabase
}

export interface DataDatabase {
  /**
   * Open a collection.
   * @param collectionName The name of the collection to open
   */
  collection<Shape extends BaseShape = any>(collectionName: string): DataCollection<Shape>
}

export interface DataCollection<Shape extends BaseShape> {
  /**
   * Insert e new document into the collection.
   * @param data The data to insert
   * @returns The ID of the document
   */
  insert(data: Partial<Shape>): Promise<Shape['_id']>

  /**
   * Update a document.
   * @param id The document ID
   * @param operations The JSON path operations to apply
   */
  update(id: Shape['_id'], operations: Operation[]): Promise<void>

  /**
   * Delete a document.
   * @param id The document ID
   * @returns 'true' if the document was deleted
   */
  delete(id: Shape['_id']): Promise<boolean>
}

export interface KeyvalProvider extends BaseProvider {}
export interface StreamProvider extends BaseProvider {}
export interface PubsubProvider extends BaseProvider {}

type DispositionToProvider<Disposition extends Dispositions> =
  Disposition extends 'data' ?  DataProvider :
  Disposition extends 'keyval' ? KeyvalProvider :
  Disposition extends 'stream' ? StreamProvider :
  Disposition extends 'pubsub' ? PubsubProvider : never

type ProviderFactory<Disposition extends Dispositions> =
  (path: string) => DispositionToProvider<Disposition>

const providersMap = new Map<Dispositions, {
  protocol: string,
  factory: (...args: any[]) => any,
}[]>()

/**
 * Register a storage provider for the given disposition and protocol.
 * @param disposition The storage disposition
 * @param protocol The protocol the provider handles (including final ':')
 * @param factory The factory which instantiates a new provider
 */
export function registerProvider<
  Disposition extends Dispositions
>(disposition: Disposition, protocol: string, factory: ProviderFactory<Disposition>) {
  if (!protocol.endsWith(':')) {
    throw new TypeError(`Invalid procotol: ${protocol}`)
  }
  const providers = providersMap.get(disposition) ?? []
  if (providers.some(provider => provider.protocol === protocol)) {
    throw new Error(`Provider with protocol "${protocol}" already registered`)
  }
  providers.push({ protocol, factory })
  providersMap.set(disposition, providers)
}

/**
 * Instantiate a provider for the given disposition, protocol, and path.
 * If no path is given, the configured path for the given disposition will be used.
 * @param disposition The storage disposition
 * @param path The storage path (defaults to the configured path for the disposition)
 * @returns A new provider instance
 */
export function buildProvider<
  Disposition extends Dispositions
>(disposition: Disposition, path = config.storage[disposition].path): DispositionToProvider<Disposition> {
  const { protocol } = new URL(path)
  if (!protocol.endsWith(':')) {
    throw new TypeError(`Invalid protocol: "${protocol}"`)
  }
  const providers = providersMap.get(disposition)
  if (!providers?.length) {
    throw new Error(`No providers found for disposition "${disposition}"`)
  }
  const factory = providers.find(provider => provider.protocol === protocol)?.factory
  if (!factory) {
    throw new Error(`No provider found for protocol "${protocol}"`)
  }
  return factory(path)
}
