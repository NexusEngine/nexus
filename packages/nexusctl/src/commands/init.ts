import type { PackageJson } from 'type-fest'
import { parse } from 'path'
import { writeFileSync, existsSync } from 'fs'
import Inquirer from 'inquirer'
import { dump } from 'js-yaml'
import { getDistTags, initializeGit, install } from '../lib/process.js'
import { checkPackage } from '../lib/helpers.js'

type Options = {
  yes: boolean,
  overwrite: boolean,
}

interface ProjectAnswers {
  name: string,
  version: string,
  description: string,
  keywords: string,
  repository: string,
}

interface EngineAnswers {
  version: string,
  shard: string,
  storage: {
    store: string,
    memory: string,
    stream: string,
  }
}

const NAME = parse(process.cwd()).base

/**
 * Initialize a new project in the current working directory.
 */
export default async function ({ yes, overwrite }: Options) {
  console.log(`\nThis wizard will walk you though setting up a new project.\n`)

  if (!overwrite && await checkPackage() === false) {
    console.log('Aborted')
    return
  }

  console.log('\nFirst we will set up your project.\n')

  const project = yes ? {
    name: NAME,
    version: '1.0.0',
    description: '',
    keywords: '',
    repository: '',
  } : await Inquirer.prompt<ProjectAnswers>([
    {
      name: 'name',
      message: 'Project name',
      suffix: ':',
      default: NAME,
    },
    {
      name: 'version',
      message: 'Project version',
      suffix: ':',
      default: '1.0.0',
    },
    {
      name: 'description',
      message: 'Project description',
      suffix: ':',
    },
    {
      name: 'repository',
      message: 'Project repository',
      suffix: ':',
    },
    {
      name: 'keywords',
      message: 'Project keywords',
      suffix: ':',
    }
  ])

  console.log('\nNext, we will set up the engine.\n')

  const distTags = await getDistTags()
  const engine = yes ? {
    version: 'latest',
    shard: 'shard0',
    storage: {
      store: 'memory://memory/game',
      memory: 'memory://memory',
      stream: 'memory://memory',
    }
  } : await Inquirer.prompt<EngineAnswers>([
    {
      type: 'list',
      name: 'version',
      message: 'Engine version',
      suffix: ':',
      default: 'latest',
      choices: distTags.map(tag => tag[0]),
    },
    {
      name: 'shard',
      message: 'Shard name',
      suffix: ':',
      default: 'shard0',
    },
    {
      name: 'storage.store',
      message: 'Path to persistent storage',
      suffix: ':',
      default: 'memory://memory/game',
    },
    {
      name: 'storage.memory',
      message: 'Path to memory store',
      suffix: ':',
      default: 'memory://memory',
    },
    {
      name: 'storage.stream',
      message: 'Path to stream store',
      suffix: ':',
      default: 'memory://memory',
    }
  ])

  const preferredEngineVersion = distTags.find(tag => tag[0] === engine.version)![1]

  console.log(`\nSelected engine version is v${preferredEngineVersion} (${engine.version})\n`)

  if (!yes) {
    const { correct } = await Inquirer.prompt<{ correct: boolean }>({
      type: 'confirm',
      name: 'correct',
      message: 'Is this correct',
      suffix: '?',
      default: true,
    })

    if (!correct) {
      console.log('Aborted')
      return
    }
  }

  const pkg: PackageJson = {
    name: project.name,
    version: project.version,
    description: project.description,
    type: 'module',
    keywords: project.keywords.split(',').map(keyword => keyword.trim()),
    repository: {
      type: 'git',
      url: `git+${project.repository}`,
    },
    scripts: {
      start: 'npx nexusctl start',
      public: 'npx nexusctl start public',
      processor: 'npx nexusctl start processor',
    },
    dependencies: {
      '@nexus-engine/engine': `^${preferredEngineVersion}`,
    },
  }

  const schema = {
    shard: engine.shard,
    storage: {
      store: {
        path: engine.storage.store,
      },
      memory: {
        path: engine.storage.memory,
      },
      stream: {
        path: engine.storage.stream,
      },
    },
  }

  console.log('\nWriting package.json...')
  writeFileSync('./package.json', JSON.stringify(pkg, null, 2))

  console.log('\nInstalling dependencies...')
  if (await install() !== 0) {
    console.log('Failed to install dependencies. Aborting.')
    return
  }

  console.log('\nWriting .nexus.yml...')
  writeFileSync('./nexus.yml', dump(schema))

  const { initGit } = yes ? { initGit: true } : await Inquirer.prompt<{ initGit: boolean }>({
    type: 'confirm',
    name: 'initGit',
    message: 'Would you like to initialize a Git repository',
    suffix: '?',
  })

  if (initGit) {
    if (await initializeGit() !== 0) {
      console.log('Failed to initialize Git repository')
    }

    if (overwrite || !existsSync('./.gitignore')) {
      console.log('\nWriting .gitignore...')
      writeFileSync('./.gitignore', 'node_modules\ndist\n.nexus.yml')
    }
  }

  console.log('\nYou\'re done!\n\nYou can now start the engine by running `npm start`')
  console.log('\nTo learn how to add mods to your project, visit https://github.com/NexusEngine/nexus')
}
