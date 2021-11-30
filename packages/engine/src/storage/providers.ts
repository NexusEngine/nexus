import { importMods } from '../config/mods.js'
import { buildProvider } from './provider.js'

await importMods('storage')

console.log([...(await import('./provider.js')).providersMap.values()])

export default {
  Data: buildProvider('data'),
  Keyval: buildProvider('keyval'),
  Stream: buildProvider('stream'),
  Pubsub: buildProvider('pubsub'),
}
