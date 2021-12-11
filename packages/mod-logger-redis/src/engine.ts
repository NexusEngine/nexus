import { RedisLogger } from './lib/logger'

if (Engine.config.logger?.path?.startsWith('redis:')) {
  Engine.register('preInitializer', async () => {
    await Engine.log.close()
    Engine.log = new RedisLogger(Engine.config.logger.path)
  })
}
