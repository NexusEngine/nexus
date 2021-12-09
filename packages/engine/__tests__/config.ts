import { readFileSync } from 'fs'
import { load } from 'js-yaml'
import { config } from '@nexus-engine/engine/dist/config/index.js'

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

describe('configuration', () => {
  // Actual config for when a local .nexus.yml file is present
  let actualConfig: any
  beforeAll(() => {
    try {
      actualConfig = load(readFileSync('.nexus.yml', 'utf-8'))
    } catch (err) {}
  })

  test('should load the configuration file or defaults', () => {
    expect(config()).toMatchObject(actualConfig ?? defaults)
  })
})
