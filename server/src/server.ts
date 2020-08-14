import { WebSocketServer } from './websocket-server'
import express from 'express'
import path from 'path'
import { CommandFrame } from 'common'
import { EventEmitter } from 'events'
import http from 'http'

let streamCounter = 0

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

    app.get('/video.mjpeg', this.handleVideo)

    const server = app.listen(port, () => console.log(`pilo listening on port ${port}`))
    const webSocketServer = new WebSocketServer({ httpServer: server })

    webSocketServer.on('command', (data: CommandFrame) => {
      this.emit(data.type, data.ps2Command)
    })
  }

  handleVideo = (req, res) => {
    const streamId = streamCounter++

    const [log, error] = [console.log, console.error].map((fn) => (...args) => {
      fn(`(streamId: ${streamId})`, ...args)
    })

    log(`Proxying video request to ${this.mjpegUrl}...`)

    const outgoingReq = http.request(this.mjpegUrl)
    .on('response', (incomingRes) => {
      log(`Received response with statusCode ${incomingRes.statusCode}. Proxying MJPEG response.`)

      res.writeHead(incomingRes.statusCode, incomingRes.statusMessage, incomingRes.headers)
      res.flushHeaders()
      incomingRes.pipe(res)

      res.on('close', () => {
        log('Response closed, destroying upstream socket.')
        incomingRes.destroy()
      })
    })
    .on('error', (err) => {
      error('Error proxying MJPEG. Is the video server running?', err)
      res.sendStatus(500)
    })

    res.on('close', () => {
      log('Response closed, destroying outgoing request.')
      outgoingReq.destroy()
    })

    outgoingReq.end()
  }
}
