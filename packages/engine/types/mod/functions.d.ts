/**
 * Generate a unique, secure alphanumeric string.
 * @param size The length of the string (default 21)
 */
declare function generateId(size?: number): Promise<string>

/**
 * Chain multiple intent checks together.
 * @param checks The intent checks
 */
declare function chainIntentChecks(...checks: (() => Promise<void>)[]): Promise<void>
