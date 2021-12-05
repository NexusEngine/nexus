import { registerGlobal } from '../utility/global'
import { hooks } from '../engine/symbols'

const engine: Nexus.Engine = {
  // register: hooks.register,
}

registerGlobal('Engine', engine)
