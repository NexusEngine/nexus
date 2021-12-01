import { importMods } from '../config/mods.js'
import { buildProvider } from './provider.js'

await importMods('storage')

export default {
  Data: buildProvider('data'),
  Keyval: buildProvider('keyval'),
  Stream: buildProvider('stream'),
  Pubsub: buildProvider('pubsub'),
}
