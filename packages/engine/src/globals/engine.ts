import { registerGlobal } from '../utility/global'
import { hooks } from '../engine/symbols'
import { FileSystemLogger } from '../engine/logger'
import { config } from '../config'

const engine: Nexus.Engine = {
  register: hooks.register,
  config: config(),
  log: new FileSystemLogger('nexus-log.log'),
}

registerGlobal('Engine', engine)
