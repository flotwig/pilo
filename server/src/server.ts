import { WebSocketServer } from './websocket-server'
import express from 'express'
import path from 'path'
import { ClientMessage } from 'common'
import { EventEmitter } from 'events'
import http from 'http'
import { isAuthorized } from './auth'

let streamCounter = 0

const unauthorizedHttpMessage = 'HTTP/1.1 401 Unauthorized\r\nwww-authenticate: basic\r\n\r\n'

export class Server extends EventEmitter {
  mjpegUrl: string
  authSha: string
  app: express.Application

  constructor(opts: { mjpegUrl: string, authSha: string }) {
    super()
    this.mjpegUrl = opts.mjpegUrl
    this.authSha = opts.authSha

    const app = this.app = express()

    app.set('x-powered-by', false)

    app.use(this.authMiddleware)

    app.use(express.static(path.join(__dirname, '../../frontend/dist')))
    app.get('/video.mjpeg', this.handleVideo)
  }

  listen(port: number) {
    const server = this.app.listen(port, () => console.log(`pilo listening on port ${port}`))
    const webSocketServer = new WebSocketServer()

    webSocketServer.on('command', (data: ClientMessage) => {
      this.emit(data.type, data.ps2Command)
    })

    server.on('upgrade', (request, socket, head) => {
      if (isAuthorized(this.authSha, request)) {
        return webSocketServer.handleUpgrade(request, socket, head)
      }

      socket.end(unauthorizedHttpMessage)
    })
  }

  authMiddleware = (req: express.Request, res: express.Response, next) => {
    if (isAuthorized(this.authSha, req)) {
      return next()
    }

    res.connection.end(unauthorizedHttpMessage)
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
