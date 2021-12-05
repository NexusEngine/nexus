import { registerGlobal } from '../utility/global'
import { hooks } from '../shard/symbols'

const shard: Nexus.Shard = {
  // register: hooks.register,
}

registerGlobal('Shard', shard)
