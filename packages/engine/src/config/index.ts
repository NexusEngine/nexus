import type { Schema } from './schema'
import { readFile } from 'fs/promises'
import { load } from 'js-yaml'
import { pathToFileURL } from 'url'

export const configPath = new URL('.engine.yaml', `${pathToFileURL(process.cwd())}/`)
const content = await async function () {
  try {
    return await readFile(configPath, 'utf-8')
  } catch (err) { }
}()

const config = function () {
  if (content) {
    return load(content) as Schema;
  } else {
    throw new Error('`.engine.yaml` not found')
  }
}()

export default config
