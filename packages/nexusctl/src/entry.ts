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
  .action(async (service = 'launcher', options) => {
    await (await import('./commands/start.js')).default(service, options)
  })

program.parse(process.argv)