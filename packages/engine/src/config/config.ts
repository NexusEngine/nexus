// npx typescript-json-schema tsconfig.json Schema --include ./packages/engine/src/config/config.ts --defaultProps --required -o ./packages/engine/src/config/config.schema.json
export type Schema = {
  /**
   * The shard name.
   */
  shard?: string,

  /**
   * Enabled mods.
   */
  mods?: string[],

  /**
   * Public API setting
   */
  public?: {
    /**
     * Public API path
     */
    path?: string
  },
  /**
   * Storage settings
   */
  storage?: {
    /**
     * Persistent data storage settings
     */
    data?: {
      /**
       * Persistent data storage path
       */
      path?: string,
    },
    /**
     * Key-value store settings
     */
    keyval?: {
      /**
       * Key-value store path
       */
      path?: string,
    },
    /**
     * Stream settings
     */
    stream?: {
      /**
       * Stream path
       */
      path?: string,
    },
    /**
     * Pub-sub settings
     */
    pubsub?: {
      /**
       * Pub-sub path
       */
      path?: string,
    },
  },
}
