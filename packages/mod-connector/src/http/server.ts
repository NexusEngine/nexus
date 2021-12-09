import { Server } from 'http'
import Koa from 'koa'
import Router from '@koa/router'

export interface Context { }
export interface State { }

export interface HttpServer extends Server {
  app: Koa<State, Context>
  router: Router<State, Context>
}

const app = new Koa<State, Context>()
const router = new Router<State, Context>()
export const server = new Server(app.callback()) as HttpServer

server.app = app
server.router = router

app.use(router.routes())
app.use(router.allowedMethods())
