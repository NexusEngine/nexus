import type { PackageJson } from 'type-fest'
import { parse } from 'path'
import { writeFileSync, existsSync } from 'fs'
import Inquirer from 'inquirer'
import { getDistTags, initializeGit, install } from '../exec.js'
import { checkPackage } from '../helpers.js'

interface ProjectAnswers {
  name: string,
  version: string,
  description: string,
  keywords: string,
  repository: string,
}

interface EngineAnswers {
  version: string,
}

const NAME = parse(process.cwd()).base

/**
 * Initialize a new project in the current working directory.
 */
export default async function () {
  console.log(`\nThis wizard will walk you though setting up a new project.\n`)

  if (await checkPackage() === false) {
    console.log('Aborted')
    return
  }

  console.log('\nFirst we will set up your project.\n')

  const project = await Inquirer.prompt<ProjectAnswers>([
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
  const engine = await Inquirer.prompt<EngineAnswers>([
    {
      type: 'list',
      name: 'version',
      message: 'Engine version',
      suffix: ':',
      default: 'latest',
      choices: distTags.map(tag => tag[0]),
    },
  ])

  const preferredEngineVersion = distTags.find(tag => tag[0] === engine.version)![1]

  console.log(`\nSelected engine version is v${preferredEngineVersion}`)

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

  console.log('\n')

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

  console.log('\nWriting package.json...')

  writeFileSync('./package2.json', JSON.stringify(pkg, null, 2))

  console.log('\nInstalling dependencies...')

  await install()

  console.log()

  const { initGit } = await Inquirer.prompt<{ initGit: boolean }>({
    type: 'confirm',
    name: 'initGit',
    message: 'Would you like to initialize a Git repository',
    suffix: '?',
  })

  if (initGit) {
    await initializeGit()

    if (!existsSync('./.gitignore')) {
      console.log('\nWriting .gitignore...')
      writeFileSync('./.gitignore', 'node_modules\ndist\n.engine.yaml')
    }
  }

  console.log('\nYou\'re done!\n\nYou can now start the engine by running `npm start`')
  console.log('\nTo learn how to add mods to your project, visit https://github.com/NexusEngine/project')
}
