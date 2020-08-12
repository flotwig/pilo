import { keysToScanCodes } from './keys-to-scan-codes'
import { CommandFrame } from 'common'

const videoImg = document.querySelector('#video')

videoImg.addEventListener('error', (err) => {
  console.error('Error connecting to MJPEG stream:', err)
})

videoImg.setAttribute('src', 'video.mjpeg')

const wsUrl = window.location.href.replace(/^http/, 'ws')
const ws = new WebSocket(wsUrl)


const handleKeyEvent = (e) => {
  const scanCode = keysToScanCodes[e.code]

  if (!scanCode) {
    console.warn(`Unmapped keypress: ${e.code}`, { e, keysToScanCodes })
    return
  }

  const ps2Command = [scanCode]

  if (e.type === 'keyup') {
    ps2Command.unshift(0xF0) // break keypress
  }

  const frame: CommandFrame = {
    type: 'ps2-command',
    ps2Command
  }

  ws.send(JSON.stringify(frame))

  e.preventDefault()
}

document.addEventListener('keydown', handleKeyEvent)
document.addEventListener('keyup', handleKeyEvent)

ws.addEventListener('error', (err) => {
  console.error('Error connecting to control websocket:', err)
})

ws.addEventListener('open', () => {
  console.log('WS connected.')
})
