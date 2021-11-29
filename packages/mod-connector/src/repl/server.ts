import type { Socket } from 'net'
import type { Middleware } from '../utility/compose'
import { Server } from 'net'
import { start } from 'repl'
import compose from '../utility/compose.js'

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
  middleware.push(...middlewares)
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

  socket.write('OK\n')

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
