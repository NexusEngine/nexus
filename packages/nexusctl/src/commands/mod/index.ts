import { Command } from 'commander'

const program = new Command

program
  .command('init [root]')
  .description('initialize a new mod project')
  .action(async (root = process.cwd(), options) => {
    await (await import('./init.js')).default(root, options)
  })

program
  .command('install [mod]')
  .description('install a mod in the current project')
  .action(async (name: string) => {
    await (await import('./install.js')).default(name)
  })

program.parse(process.argv.slice(1))
