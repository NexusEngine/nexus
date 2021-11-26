
const requiredFlags = [
  '--experimental-specifier-resolution=node',
  '--experimental-import-meta-resolve',
  '--enable-source-maps',
  '--no-warnings',
]
const extraFlags = (process.env.NODE_OPTIONS ?? '').split(/ /g).filter(flag => flag !== '')
const isMissingFlag = (flag: string) => !process.execArgv.includes(flag) && !extraFlags.includes(flag)
const missingFlags = requiredFlags.filter(isMissingFlag)
if (missingFlags.length) {
  console.error(`missing one or more required flags\nto prevent this error, run the engine with ${requiredFlags.join(' ')}`)
  process.exit(1)
}

export const services: Record<string, string> = {
  launcher: './services/launcher.js',
  public: './services/public.js',
  processor: './services/processor.js',
}
const service = process.argv[2]

if (Object.keys(services).includes(service)) {
  await import(services[service])
} else {
  console.log(`Unknown service "${service}". Supported services are: ${Object.keys(services).join(', ')}`)
}
