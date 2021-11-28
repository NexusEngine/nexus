import { Server } from 'net'
import { start } from 'repl'

const server = new Server(socket => {
  const repl = start({
    prompt: '',
    input: socket,
    output: socket,
    terminal: false,
    useColors: true,
    useGlobal: true,
    ignoreUndefined: false,
  })

  socket.once('close', () => repl.close())
})

server.listen(3406, () => {
  console.log('Connector listening on port 3406')
})
