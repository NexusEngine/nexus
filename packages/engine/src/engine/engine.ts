import { registerGlobal } from "../game/symbols"

export interface Engine {
  playerCount(): Promise<number>
}

declare global {
  var Engine: Engine
}

const engine: Engine = {
  async playerCount() {
    return parseInt(await Memory.get('playerCount'))
  }
}

registerGlobal('Engine', engine)
