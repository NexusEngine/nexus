import { hooks } from '../engine/symbols'
import { registerGlobal } from '../utility/global'

const providersMap = new Map<string, (path: string) => Nexus.Stream>()

function registerStream(protocol: string, factory: (path: string) => Nexus.Stream) {
  if (providersMap.has(protocol)) {
    throw new Error(`Stream provider with protocol "${protocol}" already registered`)
  }
  providersMap.set(protocol, factory)
}

function buildStream(path: string) {
  const url = new URL(path)
  const factory = providersMap.get(url.protocol)
  if (!factory) {
    throw new Error(`No stream provider for protocol "${url.protocol}"`)
  }
  return factory(path)
}

registerGlobal(registerStream)
registerGlobal(buildStream)

hooks.register('postInitializer', config => {
  registerGlobal('Stream', buildStream(config.storage.store.path))
})
