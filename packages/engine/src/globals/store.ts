import { hooks } from '../engine/symbols'
import { registerGlobal } from '../utility/global'
import { config } from '../config'

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

hooks.register('postInitializer', () => {
  registerGlobal('Store', buildStore(config().storage.store.path))
})
