/** Middleware interface. */
export interface Middleware<Context> {
  (context: Context, next: () => Promise<void>): Promise<void>
}

/**
 * Compose multiple middlewares into a single middleware.
 * @param stack One or more middlewares
 */
export default function compose<Context = any>(...stack: Middleware<Context>[]): Middleware<Context> {
  if (!stack.length) {
    throw new TypeError('compose() expects at least one middleware')
  }

  return async function composed(context: Context, next?: () => Promise<void>) {
    let index = -1

    async function dispatch(i: number): Promise<void> {
      if (i <= index) {
        throw new Error('next() called multiple times')
      }

      index = i
      const fn = stack[i]

      if (fn) {
        return fn(context, dispatch.bind(null, i + 1))
      } else if (next) {
        return next()
      }
    }

    return dispatch(0)
  }
}
