import { makeHookRegistration } from '../utility/hook'
import { config } from '../config/index'

export const hooks = makeHookRegistration<{
  // Executed when the engine is first started and mod manifests have been imported
  preInitializer: (c: ReturnType<typeof config>) => void,
  // Executed after storage providers have been imported
  postInitializer: (c: ReturnType<typeof config>) => void,
}>()

/**
 * Same as `registerGlobal` except it accepts more configuration options like
 * `Object.defineProperty`
 */
export function defineGlobal(name: string, descriptor: PropertyDescriptor) {
  Object.defineProperty(globalThis, name, descriptor)
}

/**
 * Register a value which will be exported to `globalThis`.
 */
export function registerGlobal(...args: [name: string, value: any] | [fn: Function]) {
  const { name, value } = args.length === 1 ?
    { name: args[0].name, value: args[0] } :
    { name: args[0], value: args[1] };
  defineGlobal(name, {
    configurable: true,
    enumerable: true,
    writable: true,
    value,
  });
}
