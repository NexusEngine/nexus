/**
 * Mod providers.
 */
declare type Provide = 'store'
  | 'memory'
  | 'stream'
  | 'game'
  | 'shard'
  | 'launcher'
  | 'processor'
  | 'public'
  | 'engine'

/**
 * The manifest provides the engine with the configuration
 * details of the mod. Each mod should export a `manifest`
 * property which conforms to this interface.
 *
 * ```ts
 * export const manifest: Manifest = {
 *   provides: 'game'
 * }
 * ```
 */
declare interface Manifest {
  /**
   * Lists the providers, if any, this mod exports
   */
  provides: Provide | Provide[] | null,

  /**
   * Map provider names to custom paths.
   */
  paths?: Partial<Record<Provide, string>>
}
