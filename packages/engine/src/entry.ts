import { config } from './config/index.js'
import { loadMods, importMods } from './config/mods.js'
import { hooks } from './engine/symbols.js'

const requiredFlags = [
  '--experimental-specifier-resolution=node',
  '--experimental-import-meta-resolve',
  '--enable-source-maps',
  '--no-warnings',
]
const extraFlags = (process.env.NODE_OPTIONS ?? '').split(/ /g).filter(flag => flag !== '')
const isMissingFlag = (flag: string) => !process.execArgv.includes(flag) && !extraFlags.includes(flag)
const missingFlags = requiredFlags.filter(isMissingFlag)
if (missingFlags.length) {
  console.error(`missing one or more required flags\nto prevent this error, run the engine with ${requiredFlags.join(' ')}`)
  process.exit(1)
}

const services: Record<string, string> = {
  launcher: './services/launcher.js',
  public: './services/public.js',
  processor: './services/processor.js',
}

const service = process.argv[2]
if (!Object.keys(services).includes(service)) {
  console.log(`Unknown service "${service}". Supported services are: ${Object.keys(services).join(', ')}`)
  process.exit(3)
}

// Import globals
import './globals'
import './game/object'

// Load mods
if (config().mods?.length) {
  await loadMods(...config().mods!)
} else {
  console.log('No enabled mods found. The engine is kind of useless without mods...')
}

// Import engine and shard providers
await Promise.all([
  importMods('engine'),
  importMods('shard'),
])

// Run pre-initialization hooks
hooks.makeIterated('preInitializer')()

// Import storage providers
await Promise.all([
  importMods('store'),
  importMods('memory'),
  importMods('stream'),
])

// Run post-initialization hooks
hooks.makeIterated('postInitializer')()

// Connect to stores
await Promise.all([
  Store.connect(),
  Memory.connect(),
  Stream.connect(),
])

// Run pre-service hooks
hooks.makeIterated('preService')()

// Import the service
await import(services[service])
