import { server as replServer } from './repl/server'
import { server as httpServer } from './http/server'

// Register the REPL server, if enabled
Engine.register('postInitializer', () => {
  const { config } = Engine
  const enableRepl = !!config.connector?.repl

  if (enableRepl) {
    const url = config.connector.repl?.path
      ? new URL(config.connector.repl.path)
      : undefined

    if (url && url.protocol !== 'tcp:') {
      throw new TypeError(`Invalid protocol "${url.protocol}", only TCP is supported`)
    }

    // await import('./repl/middleware.js')
    replServer.listen(parseInt(url?.port ?? '3046'), url?.hostname ?? 'localhost', () => {
      console.log(`Connector REPL listening on ${url ?? 'tcp://localhost:3406'}`)
    })
  }
})

// Register the HTTP server, if enabled
Engine.register('postInitializer', () => {
  const { config } = Engine
  const enableHttp = !!config.connector?.http

  if (enableHttp) {
    const url = config.connector?.http?.path
      ? new URL(config.connector.http.path)
      : undefined

    if (url && url.protocol !== 'http') {
      throw new TypeError(`Invalid protocol "${url.protocol}", only HTTP is supported`)
    }

    // await import('./http/middleware.js')
    httpServer.listen(parseInt(url?.port ?? '3407'), url?.hostname ?? 'localhost', () => {
      console.log(`Connector HTTP listening on ${url ?? 'http://localhost:3407'}`)
    })
  }
})
