import type { Schema } from './config'
import { readFile } from 'fs/promises'
import { load } from 'js-yaml'
import { pathToFileURL } from 'url'
import { merge } from '../utility/utility.js'

export const configPath = new URL('.engine.yaml', `${pathToFileURL(process.cwd())}/`)
const content = await async function () {
  try {
    return await readFile(configPath, 'utf-8')
  } catch (err) { }
}()

const data = function () {
  if (content) {
    return load(content) as Schema
  } else {
    throw new Error('`.engine.yaml` not found')
  }
}()

// These are the configuration defaults
const defaults = {
  shard: 'shard0',
  storage: {
    data: {
      path: 'memory://memory'
    },
    keyval: {
      path: 'memory://memory'
    },
    stream: {
      path: 'memory://memory'
    },
    pubsub: {
      path: 'memory://memory'
    },
  },
}

const config = {}
merge(config, defaults)
merge(config, data)
export default config as Record<string, any> & Schema & typeof defaults
