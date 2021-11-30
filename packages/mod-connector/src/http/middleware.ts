import { server } from './server.js'
import bodyParser from 'koa-bodyparser'

server.app.use(bodyParser({
  enableTypes: ['json', 'text'],
  jsonLimit: '512kb',
  textLimit: '512kb',
  extendTypes: {
    text: ['text/javascript', 'application/typescript'],
  }
}))
