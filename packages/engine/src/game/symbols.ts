import { makeHookRegistration } from '../utility/hook'

export const Intents = Symbol('Intents')
export const hooks = makeHookRegistration<Nexus.Events.Game>()
export const objectsMap = new Map<string, any>()
