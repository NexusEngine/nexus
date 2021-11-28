import config from '../config'

console.log(`Launching services for shard ${config.shard}...`)

await Promise.all([
  import('./public.js'),
  import('./processor.js'),
])
