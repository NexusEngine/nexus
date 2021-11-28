import fetch from 'node-fetch'

export class Connector {
  run = true
  /**
   * Create a `Connector` instance for the given URL.
   * @param url URL to the instance connector
   * @param token Authorization token
   */
  constructor(readonly url: string, readonly token?: string) {
    process.once('SIGINT', () => this.run = false)
  }

  /**
   * Call a command on the instance.
   * @param command The command to call
   * @param args The command arguments
   * @returns A `Response` object for the command call
   */
  async command(command: string, args: string[] = []) {
    const extraHeaders: Record<string, string> = this.token ? {
      Authorization: `Basic ${this.token}`
    } : {}

    return fetch(`${this.url}/command/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf8',
        ...extraHeaders,
      },
      body: JSON.stringify({ command, args })
    })
  }

  /**
   * Execute a script.
   * @param script The script to execute
   * @returns A `Response` object for the request
   */
  async script(script: string) {
    const extraHeaders: Record<string, string> = this.token ? {
      Authorization: `Basic ${this.token}`
    } : {}

    return fetch(`${this.url}/script/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf8',
        ...extraHeaders,
      },
      body: JSON.stringify({ script })
    })
  }
}
