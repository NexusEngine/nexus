/**
 * Generate secure URL-friendly unique ID.
 *
 * By default, the ID will have 21 symbols to
 * have a collision probability similar to UUID v4.
 * @param size The length of the string (default 21)
 * @returns A unique ID
 */
declare function generateId(size?: number): Promise<string>
