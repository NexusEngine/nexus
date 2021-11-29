import config from '../config/index.js'

export type Provide = 'storage' | 'config'

/**
 * A mod manifest presents metadata to the engine.
 * Each mod must have a manifest present in its main file.
 *
 * @example
 *
 * import type { Manifest } from '@nexus-engine/engine'
 * export const manifest: Manifest = {
 *    provides: ['storage', 'config'],
 * }
 */
export type Manifest = {
  /**
   * Keys which this mod provides to the engine.
   * A mod can provide zero, one, or more keys simultaneously.
   *
   * The appropriate files are only imported when necessary.
   */
  provides: Provide | Provide[] | null,
}

const mods: {
  specifier: string,
  manifest: Manifest,
}[] = await Promise.all((config.mods ?? []).map(async specifier => {
  const manifest = (await import(specifier)).manifest as Manifest
  return { specifier, manifest }
}))

export { mods }

/**
 * Import mods for the given provide key.
 * @param provide The provide key
 */
export async function importMods(provide: Provide) {
  for (const { specifier, manifest } of mods) {
    if (manifest.provides === provide || manifest.provides?.includes(provide)) {
      try {
        await import(`${specifier}/dist/${provide}.js`)
      } catch (err: any) {
        if (err.code === 'ERR_MODULE_NOT_FOUND') {
          console.log(`Failed to import mod "${specifier}/${provide}". Continuing without.`)
        } else {
          throw err
        }
      }
    }
  }
}
