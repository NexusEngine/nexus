import type { Schema } from './config'
import { pathToFileURL } from 'url'
import { readFile } from 'fs/promises'
import { load } from 'js-yaml'

export const configPath = new URL('.engine.yaml', `${pathToFileURL(process.cwd())}/`)
