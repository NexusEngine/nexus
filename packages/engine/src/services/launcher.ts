import config from '../config'
import { importMods } from '../config/mods.js'

console.log(`Launching services for shard ${config.shard}...`)

await importMods('storage')

await Promise.all([
  import('./public.js'),
  import('./processor.js'),
])
