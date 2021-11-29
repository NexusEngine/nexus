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
  const replHost = config.connector?.repl?.host ?? 'localhost'
  const replPort = config.connector?.repl?.port ?? 3406

  await import('./repl/middleware.js')
  replServer.listen(replPort, replHost, () => {
    console.log(`Connector REPL listening on tcp://${replHost}:${replPort}`)
  })
}

if (enableHttp) {
  const httpHost = config.connector?.http?.host ?? 'localhost'
  const httpPort = config.connector?.http?.port ?? 3407

  await import('./http/middleware.js')
  httpServer.listen(httpPort, httpHost, () => {
    console.log(`Connector HTTP listening on http://${httpHost}:${httpPort}`)
  })
}

