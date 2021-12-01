import type Engine from '@nexus-engine/engine'
import { DataProviderMongo } from './provider.js'

export default async function (engine: typeof Engine) {
  // Register the provider with the engine
  engine.registerProvider('data', 'mongodb:', path => new DataProviderMongo(path))
  console.log('storage provider registered')
}
