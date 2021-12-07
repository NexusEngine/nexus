import { Server } from 'net'
import { start } from 'repl'

export const server = new Server(socket => {
  socket.write('OK\n')

  start({
    prompt: '',
    input: socket,
    output: socket,
    terminal: false,
    useColors: true,
    useGlobal: true,
    ignoreUndefined: false,
  })
})
