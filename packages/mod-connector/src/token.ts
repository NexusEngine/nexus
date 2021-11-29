import { server } from './server.js'
import config from '@nexus-engine/engine/dist/config/index.js'

const token = (config as any).connector?.token

if (token) {
  // Only enable the token middleware if a token is configured
  server.use('connect', async (socket, next) => {
    try {
      await new Promise<void>((resolve, reject) => {
        const handleData = (data: Buffer) => {
          const str = data.toString('utf-8').trim()

          clearTimeout(timer)
          socket.removeListener('data', handleData)
          if (!str.startsWith('TOKEN')) {
            return reject('ERR_EXPECT_TOKEN')
          } else if (str.split(' ')[1].trim() !== token) {
            return reject('ERR_INVALID_TOKEN')
          }
          resolve()
        }
        socket.on('data', handleData)

        const timer = setTimeout(() => {
          socket.removeListener('data', handleData)
          reject('ERR_TIMEOUT')
        }, 5000)
      })
    } catch (err: any) {
      if (typeof err === 'string') {
        throw new Error(err)
      }
      throw err
    }
    return next()
  })
}
