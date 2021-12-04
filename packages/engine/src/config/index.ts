import type { Schema } from './config'
import { pathToFileURL } from 'url'
import { readFileSync } from 'fs'
import { load } from 'js-yaml'
import { runOnce } from '../utility/memoize'
import { merge } from '../utility/utility'

export const configPath = new URL('.nexus.yml', `${pathToFileURL(process.cwd())}/`)

const defaults = {
  shard: 'shard0',
  storage: {
    store: {
      path: 'memory://store',
    },
    memory: {
      path: 'memory://memory',
    },
    stream: {
      path: 'memory://stream',
    },
  }
}

export const config = runOnce(() => {
  try {
    const raw = readFileSync(configPath, 'utf-8')
    const content = load(raw)
    const configObj = {}
    merge(configObj, defaults)
    merge(configObj, content)
    return configObj as Record<string, any> & Schema & typeof defaults
  } catch (err) {
    return defaults as Record<string, any> & Schema & typeof defaults
  }
})
