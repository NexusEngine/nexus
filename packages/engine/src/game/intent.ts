import type { JsonObject } from 'type-fest'
import Ajv from 'ajv'
import { registerGlobal } from '../utility/global'

const ajv = new Ajv
const Intents = Symbol('Intents')

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

      return original.apply(this, context)
    }
  }
}

registerGlobal(intent)
