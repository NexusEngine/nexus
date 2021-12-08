import { connect } from 'net'
import Inquirer from 'inquirer'

/**
 * Connect to the REPL server of the instance.
 * @param urlStr The URL to connect to
 */
export default async function (urlStr: string) {
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

    try {
      const response = await waitForResponse()
      const str = response.toString('utf-8').trim()
      if (str !== 'OK') {
        console.log(`Failed to connect to instance: ${str}`)
        return
      }
    } catch (err: any) {
      console.error(`Unexpected data from connector: ${err.message ?? err}`)
      socket.end()
      return
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
