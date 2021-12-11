import { nanoid } from 'nanoid/async'
import { registerGlobal } from '../utility/global'

import './engine'
import './shard'
import './game'
import './store'
import './memory'
import './stream'

// Register ID generator
registerGlobal(async function generateId(size = 21) {
  return nanoid(size)
})
