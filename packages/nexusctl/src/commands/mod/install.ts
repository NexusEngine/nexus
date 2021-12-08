import { PackageJson } from 'type-fest'
import { existsSync, readFileSync, writeFileSync } from 'fs'
import { load, dump } from 'js-yaml'
import { install } from '../../lib/process.js'

type Options = {
  enable: boolean
}

export default async function(name: string, { enable }: Options) {
  try {
    const pkg = JSON.parse(readFileSync('./package.json', 'utf-8')) as PackageJson
    if (!pkg.dependencies || !Object.keys(pkg.dependencies).includes('@nexus-engine/engine')) {
      console.log('The current working directory is not a Nexus Engine project. Aborting.')
      return
    }
  } catch (err: any) {
    if (err.code === 'ENOENT') {
      console.log('No package.json found. Aborting')
      return
    } else if (err instanceof SyntaxError) {
      console.log('Unable to parse package.json. Aborting')
      return
    }
    throw err
  }

  if (!existsSync('./.nexus.yml')) {
    console.log('No .nexus.yml file found. Aborting.')
    return
  }

  console.log(`Installing mod ${name}...`)
  const exitCode = await install(process.cwd(), name, ['--save-peer', '--strict-peer-deps'])

  if (exitCode !== 0) {
    console.log(`Failed to install mod ${name}. Aborting`)
    return
  }

  if (enable) {
    console.log('Enabling mod...')
    const content = readFileSync('./.nexus.yml', 'utf-8')
    const config = load(content) as { mods?: string[] }
    config.mods = [...(config.mods ?? []), name]
    writeFileSync('./.nexus.yml', dump(config), 'utf-8')
  }

  console.log('\nThe mod has been installed and can now be used.')
}
