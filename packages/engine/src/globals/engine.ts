import { hooks, registerGlobal } from '../game/symbols.js'

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
