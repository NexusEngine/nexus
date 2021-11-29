import type { Socket } from 'net'
import type { Middleware } from './utility/compose'
import { Server } from 'net'
import { start } from 'repl'
import compose from './utility/compose.js'

type Events = 'connect' | 'disconnect'

/**
 * Represents a TCP server with extra types.
 */
interface ConnectorServer extends Server {
  /**
   * Register middlewares for the given event.
   * @param event The event to call the middleware for
   * @param middlewares The middlewares to call
   */
  use(event: Events, ...middlewares: Middleware<Socket>[]): void
}

const noopAsync = async () => {}
const middlewaresMap = new Map<Events, Middleware<Socket>[]>()

function use(event: Events, ...middlewares: Middleware<Socket>[]) {
  const middleware = middlewaresMap.get(event) ?? []
  middlewares.forEach(m => middleware.push(m))
  middlewaresMap.set(event, middleware)
}

async function handler(socket: Socket) {
  try {
    const middleware = middlewaresMap.get('connect')
    if (middleware?.length) {
      await compose(...(middleware))(socket, noopAsync)
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
      const middleware = middlewaresMap.get('disconnect')
      if (middleware?.length) {
        await compose(...(middleware ?? []))(socket, noopAsync)
      }
    } catch (err) { }
    repl.close()
  })
}

export const server = new Server(handler) as ConnectorServer
server.use = use.bind(server)

server.listen(3406, () => {
  console.log('Connector listening on port 3406')
})
