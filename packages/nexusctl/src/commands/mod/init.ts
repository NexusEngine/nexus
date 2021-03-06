import type { PackageJson, TsConfigJson } from 'type-fest'
import { isAbsolute, resolve } from 'path'
import { existsSync, mkdirSync, writeFileSync } from 'fs'
import { parse } from 'path'
import Inquirer from 'inquirer'
import pico from 'picocolors'
import { checkPackage } from '../../lib/helpers.js'
import { getDistTags, initializeGit, install } from '../../lib/process.js'

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
  engine: string,
  typescript: boolean,
  git: boolean,
}


export default async function (root: string, { yes, overwrite }: Options) {
  const dir = isAbsolute(root) ? root : resolve(process.cwd(), root)
  const NAME = parse(dir).base

  console.log('\nThis wizard will walk you through setting up a new mod.\n')

  if (!overwrite && await checkPackage(dir) === false) {
    console.log('Aborted')
    return
  }

  console.log('\nWe will set up your project.\n')

  const distTags = await getDistTags()
  const project = yes ? {
    name: NAME,
    version: '1.0.0',
    description: '',
    keywords: 'nexus-mod',
    repository: '',
    engine: 'latest',
    typescript: true,
    git: true,
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
    },
    {
      type: 'list',
      name: 'engine',
      message: 'Engine version',
      suffix: ':',
      default: 'latest',
      choices: distTags.map(tag => tag[0]),
    },
    {
      type: 'confirm',
      name: 'typescript',
      message: 'Would you like to use TypeScript',
      suffix: '?',
      default: true,
    },
    {
      type: 'confirm',
      name: 'git',
      message: 'Would you like to initialize a Git repository',
      suffix: '?',
      default: true,
    }
  ])

  if (!project.typescript) {
    console.log(`\nYou are ${pico.white('NOT')} using TypeScript.`)
    console.log(`Some files are expected to be in a ${pico.white('`dist`')} directory.`)
    console.log('See the documentation for more information.')
  }

  const preferredEngineVersion = distTags.find(tag => tag[0] === project.engine)![1]

  console.log(`\nSelected engine version is v${preferredEngineVersion} (${project.engine})\n`)

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
    peerDependencies: {
      '@nexus-engine/engine': `^${preferredEngineVersion}`,
    },
  }

  const tsConfig: TsConfigJson = {
    compilerOptions: {
      target: "esnext",
      module: "esnext",
      moduleResolution: "node",
      removeComments: true,
      preserveConstEnums: true,
      esModuleInterop: true,
      isolatedModules: true,
      resolveJsonModule: true,
      noImplicitAny: true,
      declaration: true,
      sourceMap: true,
      strict: true,
      allowSyntheticDefaultImports: true,
      types: ['@nexus-engine/engine'],
      outDir: 'dist',
    },
    include: ['src'],
    exclude: ['node_modules']
  }

  if (!existsSync(dir)) {
    // Create the directory
    mkdirSync(dir, { recursive: true })
  }

  console.log('Writing package.json...')
  writeFileSync(resolve(dir, './package.json'), JSON.stringify(pkg, null, 2))

  console.log('Installing dependencies...')
  if (await install(dir) !== 0) {
    console.log(pico.red('\nFailed to install dependencies. You will have to resolve this error manually.\n'))
  }

  if (project.typescript) {
    console.log('Writing tsconfig.json...')
    writeFileSync(resolve(dir, './tsconfig.json'), JSON.stringify(tsConfig, null, 2))
  }

  if (project.git) {
    console.log('Initializing Git repository...')
    await initializeGit(dir)

    if (overwrite || !existsSync(resolve(dir, './gitignore'))) {
      console.log('Writing .gitignore...')
      writeFileSync(resolve(dir, './gitignore'), 'node_modules\ndist\n.nexus.yml')
    }
  }

  console.log(pico.white('\nYour project has been initialized!'))
  console.log('To find out where to go from here, visit the documentation.')
}
