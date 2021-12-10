import { registerGlobal } from '../utility/global'
import { hooks } from '../engine/symbols'
import { Logger } from '../engine/logger'
import { config } from '../config'

const engine: Nexus.Engine = {
  register: hooks.register,
  config: config(),
  log: new Logger('nexus-log.log'),
}

registerGlobal('Engine', engine)
