import { registerGlobal } from '../utility/global'
import { hooks } from '../shard/symbols'

export interface Shard {
  register: typeof hooks.register,
}

declare global {
  var Shard: Shard
}

const shard: Shard = {
  register: hooks.register,
}

registerGlobal('Shard', shard)
