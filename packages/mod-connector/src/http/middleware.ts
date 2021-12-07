import { server } from './server'
import bodyParser from 'koa-bodyparser'

server.app.use(bodyParser({
  enableTypes: ['text', 'json'],
  extendTypes: {
    // Enable JS to be interpreted as text
    text: ['text/javascript', 'application/javascript'],
  },
  textLimit: '128kb',
  jsonLimit: '128kb',
}))
