import type { Options } from './commands/start'
import type { Service } from './lib/execute'
import { Command } from 'commander'

const program = new Command

program
  .name('nexusctl')
  .version('0.1.0', '-v, --version')

program
  .command('start [service]')
  .description('start the service')
  .action(async (service: Service = 'launcher', options: Options) => {
    await (await import('./commands/start.js')).default(service, options)
  })

program.parse(process.argv)
