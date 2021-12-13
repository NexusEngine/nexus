// Weird import because of jsonpatcherproxy's incompabible types/exports
import type { default as JSONPatcherProxyType } from 'jsonpatcherproxy'
// @ts-ignore
import { JSONPatcherProxy } from 'jsonpatcherproxy'
import { registerGlobal } from '../utility/global'

abstract class GameObject<Shape extends BaseShape> implements globalThis.GameObject<Shape> {
  #proxy: JSONPatcherProxyType<Shape>
  '#data': Shape

  constructor(data: Shape) {
    this.#proxy = new JSONPatcherProxy(data)
    this['#data'] = this.#proxy.observe(true) as Shape
  }

  get id() {
    return this['#data']._id
  }

  async flush() {
    const patches = this.#proxy.generate()
    if (patches.length) {
      await Store
        .db()
        .collection<Shape>('objects')
        .update(this['#data']._id, patches)
    }
  }

  revoke() {
    this.#proxy.revoke()
  }

  async flushAndRevoke() {
    await this.flush()
    this.revoke()
  }
}

registerGlobal(GameObject)
