import { server } from './server.js'

// Expose a `/script/` endpoint to run code in the instance
server.router.post('/script/', async (context, next) => {
  const body = context.request.body as string
  let result = new Function(body)
  if (result instanceof Promise) {
    result = await result
  }
  context.response.body = { result }
})
