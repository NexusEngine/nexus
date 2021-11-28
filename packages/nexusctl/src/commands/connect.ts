import Inquirer from 'inquirer'
import { Connector } from '../lib/connector.js'
import { commandArgs2Array, waitForCommand } from '../helpers.js'

type SpecHandler =
  (connect: Connector, args: string[]) => Promise<void>

type Options = {
  token?: string,
}

const specCommands = new Map<string, SpecHandler>()

// Display quasi-REPL help
specCommands.set('.help', async () => {
  console.log('<display help>')
})

// Exit the quasi-REPL
specCommands.set('.exit', async connect => {
  connect.run = false
  console.log('Exiting')
})

// Launch the configured editor to author a script
specCommands.set('.code', async connect => {
  const script = (await Inquirer.prompt<{ script: string }>({
    type: 'editor',
    name: 'script',
    message: 'Write a script',
  })).script

  if (!script.length) {
    console.log('Script cancelled')
    return
  }

  const response = await connect.script(script)
  if (!response.ok) {
    console.log(`Failed to execute script, got status code ${response.status}`)
  } else if (response.status === 204) {
    console.log('Script executed')
  } else {
    console.log(await response.json())
  }
})

/**
 * Connect to an engine instance and manage that instance.
 * @param url The URL to the engine instance
 * @param options Connect options
 * @param options.token Authorization token
 */
export default async function (url: string, options: Options) {
  const connect = new Connector(url, options.token)

  const response = await connect.command('INFO')
  if (!response.ok) {
    if (response.status === 401) {
      console.log('Unauthorized')
    } else {
      console.log(`Failed to connect to instance, got status code ${response.status}`)
    }
    return
  } else {
    const data = await response.json() as any
    console.log(`Connected to instance\n\n  Shard: ${data.shard}\n  Uptime: ${data.uptime}s\n  Connections: ${data.connections}\n`)
  }

  while (connect.run) {
    const line = await waitForCommand()
    const [command, ...args] = commandArgs2Array(line)
    const specCommand = specCommands.get(command)

    if (specCommand) {
      await specCommand(connect, args)
      continue
    }

    const response = await connect.command(command.toUpperCase(), args)
    if (!response.ok) {
      console.log(`Failed to execute command, got status code ${response.status}`)
      continue
    }

    console.log(await response.json())
  }
}
