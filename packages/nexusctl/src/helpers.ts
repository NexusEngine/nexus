import { resolve } from 'path'
import { existsSync } from 'fs'
import Inquirer from 'inquirer'

/**
 * Check if there exists a `package.json` in the given directory.
 * @param dir The directory (default `process.cwd()`)
 * @returns `true` if the user wants to continue, `undefined` if no file exists
 */
export async function checkPackage(dir = process.cwd()): Promise<boolean | undefined> {
  if (existsSync(resolve(dir, './package.json'))) {
    return (await Inquirer.prompt<{ overwrite: boolean }>({
      type: 'confirm',
      name: 'overwrite',
      message: 'package.json found at current location. Continue?',
      default: false,
    })).overwrite
  }
}
