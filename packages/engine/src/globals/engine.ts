import { registerGlobal } from '../utility/global'
import { hooks } from '../engine/symbols'
import { config } from '../config'

const engine: Nexus.Engine = {
  register: hooks.register,
  config: config(),
}

registerGlobal('Engine', engine)
