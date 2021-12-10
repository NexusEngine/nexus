import { nanoid } from 'nanoid/async'
import { registerGlobal } from '../utility/global'
import { Processors } from '../game/symbols'

import './engine'
import './shard'
import './game'
import './store'
import './memory'
import './stream'

registerGlobal('Processors', Processors)

// Register ID generator
registerGlobal(async function generateId(size = 21) {
  return nanoid(size)
})

// Register intent error
registerGlobal(class IntentError extends Error {
  readonly code: string
  constructor(code: string, message?: string) {
    super(message)
    this.code = code
  }
})
