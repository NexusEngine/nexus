import { registerGlobal } from '../utility/global'
import { hooks } from '../engine/symbols'

export interface Engine {
  register: typeof hooks.register,
}

declare global {
  var Engine: Engine
}

const engine: Engine = {
  register: hooks.register,
}

registerGlobal('Engine', engine)
