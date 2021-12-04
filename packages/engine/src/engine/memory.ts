import { hooks, registerGlobal } from '../game/symbols.js'

export namespace Nexus {
  export interface Memory {
    get(key: string): Promise<string>
    set(key: string, value: string): Promise<void>,
    incr(key: string): Promise<number>,
    incrBy(key: string, amount: number): Promise<number>,
    decr(key: string): Promise<number>,
    decrBy(key: string, amount: number): Promise<number>,
  }
}

declare global {
  var Memory: Nexus.Memory

  var registerMemory: (protocol: string, factory: (path: string) => Nexus.Memory) => void
  var buildMemory: (path: string) => Nexus.Memory
}

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

hooks.register('postInitializer', config => {
  registerGlobal('Memory', buildMemory(config.storage.store.path))
})
