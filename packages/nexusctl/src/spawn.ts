import { resolve } from 'path'
import { spawn } from 'child_process'

const nodeFlags = [
  '--experimental-specifier-resolution=node',
  '--experimental-import-meta-resolve',
  '--enable-source-maps',
  '--no-warnings',
]
const entry = resolve(process.cwd(), './node_modules/@nexus-engine/engine/dist/entry.js')

export function execute(service: string, flags: string[] = []) {
  const engine = spawn('node', [ ...nodeFlags, entry, service, ...flags ])
  process.stdin.pipe(engine.stdin)
  engine.stdout.pipe(process.stdout)
  engine.stderr.pipe(process.stderr)
}
