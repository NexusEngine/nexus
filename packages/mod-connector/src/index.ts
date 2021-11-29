import type { Socket } from 'net'
import type { Middleware } from './utility/compose'
import { Server } from 'net'
import { start } from 'repl'
import compose from './utility/compose.js'
// import config from '@nexus-engine/engine/dist/config'

const Middlewares = Symbol('middlewares')

type Events = 'connect' | 'disconnect'

/**
 * Represents a TCP server with extra types.
 */
interface ConnectorServer extends Server {
  [Middlewares]: Map<string, Middleware<Socket>[]>

  /**
   * Register middlewares for the given event.
   * @param event The event to call the middleware for
   * @param middlewares The middlewares to call
   */
  use(event: Events, ...middlewares: Middleware<Socket>[]): void
}

const noopAsync = async () => {}

function use(this: ConnectorServer, event: Events, ...middlewares: Middleware<Socket>[]) {
  const middleware = this[Middlewares].get(event) ?? []
  middlewares.forEach(m => middleware.push(m))
  this[Middlewares].set(event, middleware)
}

async function handler(socket: Socket) {
  try {
    const middleware = server[Middlewares].get('connect')
    if (middleware?.length) {
      await compose(...middleware)(socket, noopAsync)
    }
  } catch (err: any) {
    return socket.write(err.message ?? err, () => {
      socket.end()
    })
  }

  const repl = start({
    prompt: '',
    input: socket,
    output: socket,
    terminal: false,
    useColors: true,
    useGlobal: true,
    ignoreUndefined: false,
  })

  socket.once('close', async () => {
    try {
      const middleware = server[Middlewares].get('disconnect')
      if (middleware?.length) {
        await compose(...(middleware ?? []))(socket, noopAsync)
      }
    } catch (err) { }
    repl.close()
  })
}

export const server = new Server(handler) as ConnectorServer
server[Middlewares] = new Map()
server.use = use.bind(server)


// Token authentication middleware
const token = 'lol'
server.use('connect', async (socket, next) => {
  try {
    await new Promise<void>((resolve, reject) => {
      const handleData = (data: Buffer) => {
        const str = data.toString('utf-8').trim()
        if (!str.startsWith('TOKEN')) {
          socket.removeListener('data', handleData)
          return reject('ERR_EXPECT_TOKEN')
        }

        if (str.split(' ')[1].trim() !== token) {
          socket.removeListener('data', handleData)
          return reject('ERR_INVALID_TOKEN')
        }

        socket.removeListener('data', handleData)
        resolve()
      }
      socket.on('data', handleData)
    })
  } catch (err: any) {
    if (typeof err === 'string') {
      throw new Error(err)
    }
    throw err
  }

  socket.write('OK\n')
  return next()
})

server.listen(3406, () => {
  console.log('Connector listening on port 3406')
})
