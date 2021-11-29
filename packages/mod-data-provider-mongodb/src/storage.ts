import { registerProvider } from '@nexus-engine/engine'
import { DataProviderMongo } from './provider.js'

// Register the provider with the engine
registerProvider('data', 'mongodb:', path => new DataProviderMongo(path))
console.log('storgage provider registered')
