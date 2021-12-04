import { makeHookRegistration } from '../utility/hook'
import { config } from '../config/index'

export const hooks = makeHookRegistration<{
  // Executed when the engine is first started and mod manifests have been imported
  preInitializer: (c: ReturnType<typeof config>) => void,
  // Executed after storage providers have been imported
  postInitializer: (c: ReturnType<typeof config>) => void,
}>()
