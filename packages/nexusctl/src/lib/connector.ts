import fetch from 'node-fetch'

export class Connector {
  run = true
  constructor(readonly url: string) {
    process.once('SIGINT', () => this.run = false)
  }

  /**
   * Call a command on the instance.
   * @param command The command to call
   * @param args The command arguments
   * @returns A `Response` object for the command call
   */
  async command(command: string, args: string[] = []) {
    return fetch(`${this.url}/command/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf8',
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
    return fetch(`${this.url}/script/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf8',
      },
      body: JSON.stringify({ script })
    })
  }
}
