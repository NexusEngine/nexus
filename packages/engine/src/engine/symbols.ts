import { makeHookRegistration } from '../utility/hook'

export const hooks = makeHookRegistration<{
  /** Run when the shutdown command is given. */
  shutdown(time: number): void
}>()
