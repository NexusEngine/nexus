import { Server } from 'http'
import Koa from 'koa'
import Router from '@koa/router'
import bodyParser from 'koa-bodyparser'

interface Context {}
interface State {}

const app = new Koa<State, Context>()
const router = new Router<State, Context>()
export const server = new Server(app.callback())

router.post('/code/', async context => {
  // EXTREMELY DANGEROUS: Passing unsanized user supplied
  // data directly into the function!
  const result = Function(context.request.body.code)()
  context.response.body = { result }
})

app.use(bodyParser({
  enableTypes: ['json'],
  jsonLimit: '1mb',
}))

app.use(router.routes())
app.use(router.allowedMethods())
