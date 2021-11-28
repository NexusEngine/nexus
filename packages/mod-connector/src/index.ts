import { Server } from 'http'
import { start } from 'repl'

const server = new Server((req, res) => {
  res.setHeader('content-type', 'multipart/octet-stream')
  res.write('Welcome to the REPL\r\n')

  const repl = start({
    prompt: '> ',
    input: req,
    output: res,
    terminal: false,
    useColors: true,
    useGlobal: true,
    ignoreUndefined: false,
  })

  repl.once('exit', () => res.end())
})

server.listen(5678, () => {
  console.log('Connector listening')
})
