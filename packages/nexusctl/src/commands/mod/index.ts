import { Command } from 'commander'

const program = new Command

program
  .command('init [root]')
  .description('initialize a new mod project')
  .action(async (root = process.cwd(), options) => {
    await (await import('./init.js')).default(root, options)
  })

program.parse(process.argv.slice(1))
