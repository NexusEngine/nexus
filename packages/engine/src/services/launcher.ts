import config from '../config'

console.log(`Launching services for shard ${config.shard}...`)

// Import storage providers early
await import('../storage/index.js')

await Promise.all([
  import('./public.js'),
  import('./processor.js'),
])
