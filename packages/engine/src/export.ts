
/**
 * This is the main export file which gets imported
 * when you import the engine itself.
 *
 * All exported members are part of the Mods API.
 */

// Exported types from dependencies
export type { Operation } from 'fast-json-patch'

// Exported types for the Mods API
export type { Provide, Manifest } from './config/mods.js'
export type { Schema } from './config/config'
export type {
  BaseProvider,
  DataProvider,
  DataDatabase,
  DataCollection,
  KeyvalProvider,
  StreamProvider,
  PubsubProvider
} from './storage/provider.js'
export type { BaseShape } from './game/object.js'

// Exported values for the Mods API
export { default as config } from './config/index.js'
export { GameObject } from './game/object.js'
export { registerProvider, buildProvider } from './storage/provider.js'
