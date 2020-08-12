import { WebSocketServer } from './websocket-server'
import express from 'express'
import path from 'path'
import { CommandFrame } from 'common'
import { EventEmitter } from 'events'
import http from 'http'

export class Server extends EventEmitter {
  mjpegUrl: string
  constructor(opts: { mjpegUrl: string }) {
    super()
    this.mjpegUrl = opts.mjpegUrl
  }
  listen(port: number) {
    const app = express()
    // app.use(authMiddleware)
    app.use(express.static(path.join(__dirname, '../../frontend/dist')))

    app.get('/video.mjpeg', (req, res) => {
      http.request(this.mjpegUrl)
      .on('response', (incomingRes) => {
        incomingRes.pipe(res)
      })
      .on('error', (err) => {
        console.error('Error proxying mjpeg', err)
        res.sendStatus(500)
      })
    })

    const server = app.listen(port)
    const webSocketServer = new WebSocketServer({ httpServer: server })
    webSocketServer.on('command', (data: CommandFrame) => {
      this.emit(data.type, data.ps2Command)
    })
  }
}
