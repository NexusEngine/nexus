import config from '../config'

export type Dispositions = 'data' | 'keyval' | 'stream' | 'pubsub'

export interface DataProvider {}
export interface KeyvalProvider {}
export interface StreamProvider {}
export interface PubsubProvider {}

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
 * @param protocol The storage protocol
 * @param path The storage path (defaults to the configured path for the disposition)
 * @returns A new provider instance
 */
export function buildProvider<
  Disposition extends Dispositions
>(disposition: Disposition, protocol: string, path = config.storage[disposition].path): DispositionToProvider<Disposition> {
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
