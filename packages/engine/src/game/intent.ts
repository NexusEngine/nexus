import type { JsonObject } from 'type-fest'
import Ajv from 'ajv'
import { registerGlobal } from '../utility/global'
import { Intents, objectsMap } from './symbols'

const ajv = new Ajv

function intent<Payload extends JsonObject>(config: IntentConfig<Payload>) {
  return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
    const intents = target[Intents] ?? []
    intents.push(propertyKey)
    target[Intents] = intents

    const validate = ajv.compile(config.schema)
    const original = descriptor.value!
    descriptor.value = function (context: IntentContext<Payload>) {
      if (!validate(context.payload)) {
        throw new Error(ajv.errorsText(validate.errors))
      }

      return original.apply(this, [context])
    }
  }
}

registerGlobal(intent)

export async function intentProcessor(intent: Intent) {
  const [ name, id ] = intent.target.split(':')
  const Target = objectsMap.get(name)
  if (!Target) {
    throw new Error(`Invalid target ${name}`)
  }
  if (!Target.prototype[Intents]?.includes(intent.op)) {
    throw new Error(`Unknown op: ${intent.op}`)
  }

  const data = await Store.db().collection<any>('objects').findById(id)
  if (!data) {
    throw new Error(`Unknown id ${id}`)
  }
  const target = new Target(data)
  const ctx: IntentContext<any> = {
    payload: intent.payload,
  }

  return target[intent.op](ctx)
}
