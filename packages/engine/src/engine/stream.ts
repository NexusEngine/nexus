import { hooks, registerGlobal } from '../game/symbols.js'

export namespace Nexus {
  export interface Stream {
    get(key: string): Promise<string>
    set(key: string, value: string): Promise<void>,
  }
}

declare global {
  var Stream: Nexus.Stream

  var registerStream: (protocol: string, factory: (path: string) => Nexus.Stream) => void
  var buildStream: (path: string) => Nexus.Stream
}

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
