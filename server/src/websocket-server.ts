import * as ws from 'ws'
import * as http from 'http'
import { CommandFrame } from 'common'
import { EventEmitter } from 'events'

let connectionCounter = 0

export class WebSocketServer extends EventEmitter {
  constructor(opts: {
    httpServer: http.Server
  }) {
    super()

    const server = new ws.Server({ server: opts.httpServer })

    server.on('connection', (socket) => {
      const connectionId = connectionCounter++
      console.log(`Websocket connection received (connectionId: ${connectionId})`)

      socket.on('message', (data: string) => {
        const parsed: CommandFrame = JSON.parse(data)
        console.log(`Received command (connectionId: ${connectionId})`, parsed)

        this.emit('command', parsed)
      })

      socket.on('close', () => {
        console.log(`Websocket disconnected (connectionId: ${connectionId})`)
      })
    })
  }
}
