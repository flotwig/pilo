import * as ws from 'ws'
import { CommandFrame } from 'common'
import { EventEmitter } from 'events'

let connectionCounter = 0

export class WebSocketServer extends EventEmitter {
  wss: ws.Server

  constructor() {
    super()

    const wss = this.wss = new ws.Server({ noServer: true })

    wss.on('connection', (socket) => {
      const connectionId = connectionCounter++
      console.log(`Websocket connection received (connectionId: ${connectionId})`)

      socket.on('message', (data: string) => {
        const parsed: CommandFrame = JSON.parse(data)
        console.log(`Received command (connectionId: ${connectionId})`, parsed.type)

        this.emit('command', parsed)
      })

      socket.on('close', () => {
        console.log(`Websocket disconnected (connectionId: ${connectionId})`)
      })
    })
  }

  handleUpgrade = (request, socket, head) => {
    this.wss.handleUpgrade(request, socket, head, function done(ws) {
      this.wss.emit('connection', ws)
    })
  }
}
