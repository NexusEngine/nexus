import type { Options } from './commands/start'
import { Service } from './lib/spawn.js'
import { Command } from 'commander'

const program = new Command

program
  .name('nexusctl')
  .version('0.1.0', '-v, --version')

program
  .command('init')
  .description('initialize a new project')
  .action(async () => {
    await (await import('./commands/init.js')).default()
  })

program
  .command('start [service]')
  .description('start the service')
  .action(async (service: Service = 'launcher', options: Options) => {
    await (await import('./commands/start.js')).default(service, options)
  })

program
  .command('connect [url]')
  .description('connect to the instance')
  .action(async (url = 'http://localhost:3406', options) => {
    await (await import('./commands/connect.js')).default(url, options)
  })

program.parse(process.argv)
