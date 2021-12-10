import type { PackageJson } from 'type-fest'
import { readFileSync } from 'fs'
import { Command } from 'commander'

// Load package.json just to get the name and version
const url = new URL('../package.json', import.meta.url)
const pkg = JSON.parse(readFileSync(url, 'utf-8')) as PackageJson

const program = new Command
const mod = new Command('mod').description('manage mods')

program
  .name(pkg.name!)
  .version(pkg.version!)

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
  .action(async (service = 'launcher', options) => {
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
  .alias('i')
  .description('install a mod in the current project')
  .option('-e, --enable', 'enable the mod', false)
  .option('-f, --force', 'force install', false)
  .action(async (name: string, options) => {
    await (await import('./commands/mod/install.js')).default(name, options)
  })

program.addCommand(mod)
program.parse(process.argv)
