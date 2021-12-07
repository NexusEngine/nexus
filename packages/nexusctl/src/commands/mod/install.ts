import { PackageJson } from 'type-fest'
import { existsSync, readFileSync } from 'fs'
import { install } from '../../lib/process.js'

export default async function(name: string) {
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

  console.log('\nThe mod has been installed and can now be used.')
  console.log('If you\'re unsure of how to enable the mod, visit the documentation.')
}
