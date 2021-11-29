import { server } from './server.js'
import './token.js'

server.listen(3406, () => {
  console.log('Connector REPL listening on port 3406')
})
