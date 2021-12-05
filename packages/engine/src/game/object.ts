// NOTE: Weird import because of jsonpatcherproxy's messed up types
import type { default as JSONPatcherProxyType } from 'jsonpatcherproxy'
// @ts-expect-error
import { JSONPatcherProxy } from 'jsonpatcherproxy'
import { registerGlobal } from '../utility/global'

abstract class GameObject<Shape extends BaseShape> {
  readonly ['#dbName']: string | null
  readonly ['#collectionName']: string
  ['#data']: Shape
  #proxy: JSONPatcherProxyType<Shape>

  constructor(data: Shape)
  constructor(dbName: string | null, collectionName: string, data: Shape)
  constructor(dbOrData: Shape | string | null, collectionName?: string, data?: Shape) {
    if (arguments.length === 1) {
      this['#dbName'] = null
      this['#collectionName'] = 'objects'
    } else {
      this['#dbName'] = dbOrData as string | null
      this['#collectionName'] = collectionName!
    }
    this.#proxy = new JSONPatcherProxy(data ?? dbOrData)
    this['#data'] = this.#proxy.observe(true) as Shape
  }

  get id() { return this['#data']._id }

  /**
   * Flush the pending shape changes to the store.
   */
  async flush() {
    const patches = this.#proxy.generate()
    if (patches.length) {
      await Store
        .db(this['#dbName'] ?? undefined)
        .collection<Shape>(this['#collectionName'])
        .update(this.id, patches)
    }
  }

  /**
   * Revoke the data observer proxy, preparing it for garbage collection.
   */
  revoke() {
    this.#proxy.revoke()
  }

  /**
   * Flush changes to storage and revoke the data observer proxy.
   */
  async flushAndRevoke() {
    await this.flush()
    this.revoke()
  }
}

registerGlobal(GameObject)
