import { resolve } from 'path'
import { existsSync } from 'fs'
import Inquirer from 'inquirer'

/**
 * Check if there exists a `package.json` in the given directory
 * and if so, ask the user if they want to overwrite it.
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

/**
 * Wait for the user to input a command.
 * @returns The command
 */
export async function waitForCommand(): Promise<string> {
  return (await Inquirer.prompt<{ command: string }>({
    name: 'command',
    prefix: '',
    message: '>',
  })).command
}

/**
 * Parse a string to an arguments array.
 * @param text The text string
 * @returns An array containing values
 */
export function commandArgs2Array(text: string) {
  const re = /^"[^"]*"$/
  const re2 = /^([^"]|[^"].*?[^"])$/

  let arr: string[] = []
  let argPart: any = null

  text && text.split(" ").forEach(function (arg) {
    if ((re.test(arg) || re2.test(arg)) && !argPart) {
      arr.push(arg)
    } else {
      argPart = argPart ? argPart + " " + arg : arg
      if (/"$/.test(argPart)) {
        arr.push(argPart)
        argPart = null
      }
    }
  })

  return arr
}
