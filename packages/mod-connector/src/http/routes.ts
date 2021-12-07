import { server } from './server'

server.router.post('/script/', async context => {
  const isJavaScript = context.request.type.includes('javascript')

  if (!isJavaScript) {
    context.response.status = 400
    context.response.body = {
      error: 'Expected JavaScript'
    }
  }

  try {
    let result = new Function(context.request.body)()
    if (result instanceof Promise) {
      result = await result
    }

    context.response.status = 201
    context.response.body = { result }
  } catch (err: any) {
    context.response.status = 400
    context.response.body = {
      error: err.message ?? err
    }
  }
})
