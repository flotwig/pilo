import { Server } from './server'
import { Keyboard } from './keyboard'

if (!process.env.AUTH_SHA) {
  throw new Error('AUTH_SHA was not set.')
}

const port = Number(process.env.PORT || 3000)

const keyboard = new Keyboard({
  path: process.env.SERIAL_PATH || '/dev/ttyUSB0',
  baudRate: Number(process.env.SERIAL_BAUD_RATE || 9600)
})

const server = new Server({
  mjpegUrl: process.env.MJPEG_URL || 'http://127.0.0.1:9000/stream/video.mjpeg',
  authSha: process.env.AUTH_SHA
})

server.on('ps2-command', (ps2Command) => {
  keyboard.send(ps2Command)
})

server.listen(port)
