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
export async function install(): Promise<number>
export async function install(cwd: string): Promise<number>
export async function install(cwd: string, name: string, flags?: string[]): Promise<number>
export async function install(cwd = process.cwd(), name?: string, flags: string[] = []) {
  return new Promise<number>(resolve => {
    const allFlags = ['install', ...(name ? [name] : []), ...flags]
    const child = spawn('npm', allFlags, { shell: true, cwd })
    child.stdout!.pipe(process.stdout, { end: false })
    child.stderr!.pipe(process.stderr, { end: false })
    child.once('exit', () => resolve(child.exitCode!))
  })
}

/**
 * Initialize an empty Git repository.
 */
export async function initializeGit(cwd = process.cwd()) {
  return new Promise<number>(resolve => {
    const child = spawn('git', ['init', '-b', 'main'], { cwd })
    child.stdout!.pipe(process.stdout, { end: false })
    child.stderr!.pipe(process.stderr, { end: false })
    child.once('exit', () => resolve(child.exitCode!))
  })
}
