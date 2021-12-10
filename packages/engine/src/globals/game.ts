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
  registerIntentProcessor(receiver, intent, processor) {
    const processors = receiver.prototype[Processors] = receiver.prototype[Processors] ?? {}
    processors[intent] = processor
  },
  async executeIntent(target, intent, context, ...args) {
    const processor = target[Processors]?.[intent]
    if (!processor) {
      throw new Error(`Missing intent processor for ${target}`)
    }
    await processor(target, context, ...args)
  }
}

registerGlobal(async function chainIntentChecks(...checks: (() => Promise<void>)[]) {
  for (const check of checks) {
    await check()
  }
})

registerGlobal('Game', game)
