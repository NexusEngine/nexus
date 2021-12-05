import { hooks } from '../engine/symbols'
import { registerGlobal } from '../utility/global'
import { config } from '../config'

const providersMap = new Map<string, (path: string) => Nexus.Memory>()

function registerMemory(protocol: string, factory: (path: string) => Nexus.Memory) {
  if (providersMap.has(protocol)) {
    throw new Error(`Memory provider with protocol "${protocol}" already registered`)
  }
  providersMap.set(protocol, factory)
}

function buildMemory(path: string) {
  const url = new URL(path)
  const factory = providersMap.get(url.protocol)
  if (!factory) {
    throw new Error(`No memory provider for protocol "${url.protocol}"`)
  }
  return factory(path)
}

registerGlobal(registerMemory)
registerGlobal(buildMemory)

hooks.register('postInitializer', () => {
  registerGlobal('Memory', buildMemory(config().storage.store.path))
})
