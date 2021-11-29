
/**
 * This is the main export file which gets imported
 * when you import the engine itself.
 *
 * All exported members are part of the Mods API.
 */

export type { Schema } from './config/config'

export { default as config } from './config/index.js'
export { GameObject } from './objects/GameObject.js'
export { registerProvider, buildProvider } from './storage/provider.js'
