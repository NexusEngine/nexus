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
  .option('-y, --yes', 'accept defaults', false)
  .option('--overwrite',  'overwrite existing files', false)
  .action(async (options) => {
    await (await import('./commands/init.js')).default(options)
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
  .action(async (url = 'tcp://localhost:3406') => {
    await (await import('./commands/connect.js')).default(url)
  })

mod
  .command('init [root]')
  .description('initialize a new mod project')
  .option('-y, --yes', 'accept defaults', false)
  .option('--overwrite', 'overwrite existing files', false)
  .action(async (root = process.cwd(), options) => {
    await (await import('./commands/mod/init.js')).default(root, options)
  })

mod
  .command('install <mod>')
  .description('install a mod in the current project')
  .option('-e, --enable', 'enable the mod', false)
  .option('-f, --force', 'force reinstall', false)
  .action(async (name: string, options) => {
    await (await import('./commands/mod/install.js')).default(name, options)
  })

program.addCommand(mod)
program.parse(process.argv)
