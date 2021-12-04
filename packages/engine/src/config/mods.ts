
declare global {
  type Provide = 'store'
    | 'memory'
    | 'stream'
    | 'game'
    | 'shard'
    | 'launcher'
    | 'processor'
    | 'public'

  interface Manifest {
    provides: Provide | Provide[] | null,
    paths?: Partial<Record<Provide, string>>
  }
}

const loaded = new Set<string>()
export const mods: {
  specifier: string,
  manifest: Manifest,
}[] = []

export async function loadMods(...specifiers: string[]) {
  for (const specifier of specifiers) {
    if (loaded.has(specifier)) {
      continue
    }
    try {
      const manifest = (await import(specifier)).manifest as Manifest
      mods.push({ specifier, manifest })
      loaded.add(specifier)
    } catch (err: any) {
      if (err.code === 'ERR_MODULE_NOT_FOUND') {
        console.log(`Failed to load mod "${specifier}". Continuing without.`)
        console.error(err)
      } else {
        throw err
      }
    }
  }
}

export async function importMods(provide: Provide) {
  for (const { specifier, manifest } of mods) {
    if (manifest.provides === provide || manifest.provides?.includes(provide)) {
      const path = manifest.paths?.[provide] ?? `/dist/${provide}.js`
      try {
        await import(`${specifier}${path}`)
      } catch (err: any) {
        if (err.code === 'ERR_MODULE_NOT_FOUND') {
          console.log(`Failed to import mod "${specifier}${path}". Continuing without.`)
        }
      }
    }
  }
}
