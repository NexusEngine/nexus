import { hooks, objectsMap } from '../game/symbols'
import { registerGlobal } from '../utility/global'

const game: Nexus.Game = {
  register: hooks.register,
  registerObject(target) {
    if (objectsMap.has(target.name)) {
      throw new Error(`Game object with name "${target.name}" already registered`)
    }
    objectsMap.set(target.name, target)
  }
}

registerGlobal('Game', game)
