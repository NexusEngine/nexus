import { makeHookRegistration } from '../utility/hook'

export const Processors = Symbol('processors')
export const hooks = makeHookRegistration<Nexus.Events.Game>()
