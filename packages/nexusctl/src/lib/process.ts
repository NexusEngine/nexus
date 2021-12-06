import { exec, spawn } from 'child_process'

/**
 * Get all dist-tags and their versions.
 * @returns An array containing an array of tag name and version
 */
export async function getDistTags(): Promise<string[][]> {
  return new Promise<string[][]>((resolve, reject) => {
    exec('npm dist-tags @ageira/base-rate-calculator', (err, result) => {
      return err ? reject(err) : resolve(result.split('\n').map(line => line.trim().split(': ')))
    })
  })
}

/**
 * Run `npm install`.
 */
export async function install(cwd = process.cwd()) {
  return new Promise<void>(resolve => {
    const child = spawn('npm', ['install'], { shell: true, cwd })
    child.stdout!.pipe(process.stdout, { end: false })
    child.stderr!.pipe(process.stderr, { end: false })
    child.stdout!.once('close', resolve)
  })
}

/**
 * Initialize an empty Git repository.
 */
export async function initializeGit(cwd = process.cwd()) {
  return new Promise<void>(resolve => {
    const child = spawn('git', ['init', '-b', 'main'], { cwd })
    child.stdout!.pipe(process.stdout, { end: false })
    child.stderr!.pipe(process.stderr, { end: false })
    child.stdout!.once('close', resolve)
  })
}
