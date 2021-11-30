import type { Manifest } from '@nexus-engine/engine'
import { config } from '@nexus-engine/engine'
import { server as httpServer } from './http/server.js'
import { server as replServer } from './repl/server.js'

export { server as replServer } from './repl/server.js'
export { server as httpServer } from './http/server.js'

export const manifest: Manifest = {
  provides: null,
}

const enableRepl = !!config.connector?.repl
const enableHttp = !!config.connector?.http

if (enableRepl) {
  const url = config.connector.repl?.path
    ? new URL(config.connector.repl.path)
    : undefined

  await import('./repl/middleware.js')
  replServer.listen(parseInt(url?.port ?? '3046'), url?.hostname ?? 'localhost', () => {
    console.log(`Connector REPL listening on ${url ?? 'http://localhost:3406'}`)
  })
}

if (enableHttp) {
  const url = config.connector?.http?.path
    ? new URL(config.connector.http.path)
    : undefined

  await import('./http/middleware.js')
  httpServer.listen(parseInt(url?.port ?? '3407'), url?.hostname ?? 'localhost', () => {
    console.log(`Connector HTTP listening on ${url ?? 'tcp://localhost:3407'}`)
  })
}

