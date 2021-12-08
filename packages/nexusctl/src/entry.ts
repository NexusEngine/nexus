import type { Options } from './commands/start'
import type { Service } from './lib/execute'
import { Command } from 'commander'

const program = new Command
const mod = new Command('mod').description('manage mods')

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
  .description('connect to the instance repl')
  .option('-t, --token', 'authentication token')
  .action(async (url = 'tcp://localhost:3406', options) => {
    await (await import('./commands/connect.js')).default(url, options)
  })

mod
  .command('init [root]')
  .description('initialize a new mod project')
  .action(async (root = process.cwd(), options) => {
    await (await import('./commands/mod/init.js')).default(root, options)
  })

mod
  .command('install <mod>')
  .description('install a mod in the current project')
  .action(async (name: string) => {
    await (await import('./commands/mod/install.js')).default(name)
  })

program.addCommand(mod)
program.parse(process.argv)
