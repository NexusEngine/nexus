import config from '../config/index.js'

export type Provide = 'storage' | 'config'
export type Manifest = {
  provides: Provide | Provide[],
}

const mods: {
  specifier: string,
  manifest: Manifest,
}[] = []
async function resolve(specifiers: string[]) {
  mods.push(...await Promise.all(specifiers.map(async specifier => {
    const manifest = (await import(specifier)).manifest as Manifest
    return { specifier, manifest }
  })))
}
await resolve(config.mods ?? [])

export { mods }
export async function importMods(provide: Provide) {
  for (const { specifier, manifest } of mods) {
    if (manifest.provides === provide || manifest.provides.includes(provide)) {
      // TODO: This doesn't work yet
      await import(`${specifier}/dist/${provide}.js`)
    }
  }
}
