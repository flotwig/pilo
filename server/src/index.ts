import { Server } from './server'
import { Keyboard } from './keyboard'

const keyboard = new Keyboard({
  path: '/dev/ttyUSB0',
  baudRate: 9600
})

const server = new Server({
  mjpegUrl: 'http://127.0.0.1:9000/stream/video.mjpeg'
})

server.on('ps2-command', (ps2Command) => {
  keyboard.send(ps2Command)
})

const port = Number(process.env.PORT || 3000)

server.listen(port)
