import { registerGlobal } from '../game/symbols'

export interface Game {
  registerObject<Target extends typeof GameObject>(target: Target, name?: string): void
}

declare global {
  var Game: Game
}

const objectsMap = new Map<string, typeof GameObject>()

const game: Game = {
  registerObject(target, name = target.name) {
    if (objectsMap.has(name)) {
      throw new Error(`Game object with name "${name}" already registered`)
    }
    objectsMap.set(name, target)
  },
}

registerGlobal('Game', game)
