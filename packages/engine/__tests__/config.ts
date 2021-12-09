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
  test('should load default configuration', () => {
    expect(config()).toMatchObject(defaults)
  })
})
