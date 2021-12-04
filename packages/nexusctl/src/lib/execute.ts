import { resolve } from 'path'
import { spawn } from 'child_process'

export type Service = 'launcher' | 'public' | 'processor'

const nodeFlags = [
  '--experimental-specifier-resolution=node',
  '--experimental-import-meta-resolve',
  '--enable-source-maps',
  '--no-warnings',
]
export const entry = resolve(process.cwd(), './node_modules/@nexus-engine/engine/dist/entry.js')

/**
 * Execute an engine service.
 * @param service The service to execute
 * @param flags The flags to use
 */
export function execute(service: Service, flags: string[] = []) {
  const engine = spawn('node', [...nodeFlags, entry, service, ...flags])
  process.stdin.pipe(engine.stdin)
  engine.stdout.pipe(process.stdout)
  engine.stderr.pipe(process.stderr)
}
