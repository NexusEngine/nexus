import { Server } from 'net'
import { start, REPL_MODE_STRICT } from 'repl'

export const server = new Server(socket => {
  socket.write('OK\n')

  start({
    prompt: '',
    input: socket,
    output: socket,
    terminal: true,
    useColors: true,
    useGlobal: true,
    ignoreUndefined: false,
    replMode: REPL_MODE_STRICT,
    breakEvalOnSigint: true,
  })
})
