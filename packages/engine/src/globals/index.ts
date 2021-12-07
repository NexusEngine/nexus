import { customAlphabet } from 'nanoid/async'
import { registerGlobal } from '../utility/global'

import './engine'
import './shard'
import './game'
import './store'
import './memory'
import './stream'

// Register custom ID generator
const alphabet = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUWVXYZ0987654321'
registerGlobal(async function generateId(size = 12) {
  return customAlphabet(alphabet, size)()
})
