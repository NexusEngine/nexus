import type { Service } from '../spawn'
import { existsSync } from 'fs'
import { entry, execute } from '../spawn.js'

export type Options = {}

/**
 * Start the given engine service.
 * @param service The service to start
 * @param options Options
 */
export default async function (service: Service, options: Options) {
  if (!existsSync(entry)) {
    console.log('Engine entry point not found. Are you sure you have installed the engine?')
    return
  }

  execute(service)
}
