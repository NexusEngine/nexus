import type { Operation } from 'fast-json-patch'
import type { BaseShape } from '../objects/object.js'
import config from '../config'
import { Effect } from '../utility/types.js'

export type Dispositions = 'data' | 'keyval' | 'stream' | 'pubsub'

/**
 * Represents common properties between all storage providers.
 */
export interface BaseProvider {
  /**
   * Whether or not the provider is currently connected.
   */
  connected: boolean

  /**
   * Connect to the provider.
   */
  connect(): Promise<void>

  /**
   * Disconnect from the provider.
   */
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

/**
 * Represents database storage.
 */
export interface DataDatabase {
  /**
   * Open a collection.
   * @param collectionName The name of the collection to open
   */
  collection<Shape extends BaseShape = any>(collectionName: string): DataCollection<Shape>
}

/**
 * Represents collection storage.
 */
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

/**
 * Represents key-value storage.
 */
export interface KeyvalProvider extends BaseProvider {}

/**
 * Represents stream storage.
 */
export interface StreamProvider extends BaseProvider {
  /**
   * Add an entry to the given stream.
   * @param key The stream key
   * @param id The stream ID. If not set, one is generated
   * @param values A key-value object containing the values to storage
   */
  add(key: string, id: string, values: Record<string, any>): Promise<string>

  /**
   * Start reading from the given stream.
   * @param key The stream key
   * @param options Additional options
   * @param options.id The ID to start reading from
   * @param options.signal The abort signal
   */
  read<Type extends Record<string, any> = any>(key: string, options: {
    id?: string,
    signal?: AbortSignal,
  }): AsyncIterableIterator<[string, Type]>
}

/**
 * Represents publish-subscribe storage.
 */
export interface PubsubProvider extends BaseProvider {
  /**
   * Publish an event and optional values over the given channel.
   * @param channel The channel to publish to
   * @param event The event to publish
   * @param values The values to publish
   */
  publish(channel: string, event: string, values?: Record<string, any>): Promise<void>

  /**
   * Subscribe to a channel.
   * @param channel The channel to subscribe to
   * @param fn The handler function
   * @returns An effect to unsubscribe from the channel
   */
  subscribe(channel: string, fn: (event: string, values: Record<string, any>) => void): () => Effect
}

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
