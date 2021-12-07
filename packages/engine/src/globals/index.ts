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
registerGlobal('generateId', customAlphabet(alphabet, 12))
