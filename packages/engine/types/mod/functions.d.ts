declare module 'mods' {
  global {
    /**
     * Generate a unique, secure alphanumeric string.
     * @param size The length of the string (default 21)
     */
    function generateId(size?: number): Promise<string>

    /**
     * Chain multiple intent checks together.
     * @param checks The intent checks
     */
    function chainIntentChecks(...checks: (() => Promise<void>)[]): Promise<void>
  }
}
