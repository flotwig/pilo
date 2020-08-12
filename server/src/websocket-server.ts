import * as ws from 'ws'
import * as http from 'http'
import { CommandFrame } from 'common'
import { EventEmitter } from 'events'

export class WebSocketServer extends EventEmitter {
  constructor(opts: {
    httpServer: http.Server
  }) {
    super()
    const server = new ws.Server({ server: opts.httpServer })
    server.on('connection', (socket) => {
      socket.on('message', (data: CommandFrame) => {
        this.emit('command', data)
      })
    })
  }
}
