import { PackageJson } from 'type-fest'
import { existsSync, readFileSync, writeFileSync } from 'fs'
import { load, dump } from 'js-yaml'
import { install } from '../../lib/process.js'

type Options = {
  enable: boolean
}

export default async function(name: string, { enable }: Options) {
  if (!existsSync('./package.json')) {
    console.log('No package.json found. Aborting.')
    return
  } else {
    const pkg = JSON.parse(readFileSync('./package.json', 'utf-8')) as PackageJson
    if (!pkg.dependencies || !Object.keys(pkg.dependencies).includes('@nexus-engine/engine')) {
      console.log('The current working directory is not a Nexus Engine project. Aborting.')
      return
    }
  }

  if (!existsSync('./.nexus.yml')) {
    console.log('No .nexus.yml file found. Aborting.')
    return
  }

  console.log(`Installing mod ${name}...`)
  await install(undefined, name, ['--save-peer', '--strict-peer-deps'])

  if (enable) {
    console.log('Enabling mod...')
    const content = readFileSync('./.nexus.yml', 'utf-8')
    const config = load(content) as { mods?: string[] }
    config.mods = [...(config.mods ?? []), name]
    writeFileSync('./.nexus.yml', dump(config), 'utf-8')
  }

  console.log('\nThe mod has been installed and can now be used.')
}
