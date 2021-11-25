import { execute } from '../spawn.js'

type Service = 'launcher' | 'public' | 'processor'
type Options = {}

export default async function (service: Service, options: Options) {
  execute(service)
}
