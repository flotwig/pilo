import SerialPort from 'serialport'

export class Keyboard {
  port: SerialPort

  constructor(opts: {
    path: string
    baudRate: number
  }) {
    this.port = new SerialPort(opts.path, opts)
  }

  send(command: number[]) {
    this.port.write(command)
  }
}
