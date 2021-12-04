import { makeHookRegistration } from '../utility/hook'

export const hooks = makeHookRegistration<{
  /** Run on instance initialization. */
  environment(): void,
  /** Run when an instance has started up. */
  startup(id: string): void
  /** Run when the shutdown command is given. */
  shutdown(time: number): void
}>()
