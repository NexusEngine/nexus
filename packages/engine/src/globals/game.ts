import { hooks } from '../game/symbols'
import { registerGlobal } from '../utility/global'

const objectsMap = new Map<string, typeof GameObject>()

const game: Nexus.Game = {
  register: hooks.register,
  registerObject(target, name = target.name) {
    if (objectsMap.has(name)) {
      throw new Error(`Game object with name "${name}" already registered`)
    }
    objectsMap.set(name, target)
  },
}

registerGlobal(async function chainIntentChecks(...checks: (() => Promise<void>)[]) {
  for (const check of checks) {
    await check()
  }
})

registerGlobal('Game', game)
