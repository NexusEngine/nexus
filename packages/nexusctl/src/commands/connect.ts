import { connect } from 'net'
import Inquirer from 'inquirer'

type Options = {
  token?: string,
}

/**
 * Connect to the REPL server of the instance.
 * @param urlStr The URL to connect to
 * @param options Additional options
 * @param options.token Authentication token
 */
export default async function (urlStr: string, options: Options = {}) {
  const url = new URL(urlStr)
  const socket = connect({
    port: parseInt(url.port ?? '3406'),
    host: url.hostname,
  }, async () => {
    async function waitForExpression() {
      return (await Inquirer.prompt<{ expression: string }>({
        name: 'expression',
        message: '>',
        prefix: '',
        suffix: '',
      })).expression
    }

    async function waitForResponse() {
      return new Promise<Buffer>(resolve => {
        socket.once('data', resolve)
      })
    }

    if (options.token) {
      socket.write(`TOKEN ${options.token}\r\n`)
      const response = await waitForResponse()
      if (response.toString('utf-8').trim() !== 'OK') {
        console.error(`Failed to authenticate to instance: ${response.toString('utf-8')}`)
        return
      }
    }

    let run = true
    process.once('SIGINT', () => run = false)
    console.log(`Connected to REPL at ${url}\n`)

    while (run) {
      const expression = await waitForExpression()
      if (expression === '.exit') {
        break
      }

      socket.write(`${expression}\r\n`)
      const response = await waitForResponse()
      console.log(response.toString('utf-8'))
    }

    socket.end(() => {
      console.log('Exited REPL')
    })
  })
}
