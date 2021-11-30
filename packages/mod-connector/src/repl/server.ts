import type { Socket } from 'net'
import type { Middleware } from '../utility/compose'
import { Server } from 'net'
import { start } from 'repl'
import compose from '../utility/compose.js'
import { Middlewares } from './symbols.js'

type Events = 'connect' | 'disconnect'

export interface Context {
  socket: Socket,
}

/**
 * Represents a TCP server with extra types.
 */
export interface ReplServer extends Server {
  [Middlewares]: Map<string, Middleware<Context>[]>

  /**
   * Register middlewares for the given event.
   * @param event The event to call the middleware for
   * @param middlewares The middlewares to call
   */
  use(event: Events, ...middlewares: Middleware<Context>[]): void
}

const noopAsync = async () => {}

function use(this: ReplServer, event: Events, ...middlewares: Middleware<Context>[]) {
  const middleware = this[Middlewares].get(event) ?? []
  middleware.push(...middlewares)
  this[Middlewares].set(event, middleware)
}

async function handler(socket: Socket) {
  try {
    const middleware = server[Middlewares].get('connect')
    if (middleware?.length) {
      await compose(...middleware)({ socket }, noopAsync)
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
        await compose(...(middleware ?? []))({ socket }, noopAsync)
      }
    } catch (err) { }
    repl.close()
  })
}

export const server = new Server(handler) as ReplServer
server[Middlewares] = new Map()
server.use = use.bind(server)
