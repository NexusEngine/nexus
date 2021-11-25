import { parse } from 'path'
import Inquirer from 'inquirer'
import { getDistTags } from '../exec.js'
import { checkPackage } from '../helpers.js'

interface ProjectAnswers {
  name: string,
  version: string,
  description: string,
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

  const pkg = {
    name: project.name,
    version: project.version,
    description: project.description,
    scripts: {
      start: 'npx nexusctl start',
      public: 'npx nexusctl start public',
      processor: 'npx nexusctl start processor',
    },
    dependencies: {
      '@nexus-engine/engine': `^${preferredEngineVersion}`,
    },
  }

  console.log(pkg)
}
