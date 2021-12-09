import { readFileSync } from 'fs'
import { load } from 'js-yaml'

describe('test 1', () => {
  test('should pass', () => {
    const text = readFileSync('.nexus.yml', 'utf-8')
    const content = load(text) as any
    expect(content).toHaveProperty('shard')
    expect(content).toHaveProperty('storage')
  })
})
