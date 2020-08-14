import log from './log'
import {
  getBreakBytes,
  getMakeBytes,
} from 'keycodes-to-ps2-scan-codes'
import { CommandFrame } from 'common'

export function startControls() {
  log.info('Connecting to websocket...')
  const wsUrl = window.location.href.replace(/^http/, 'ws')
  const ws = new WebSocket(wsUrl)

  ws.addEventListener('error', (err) => {
    log.error('Error connecting to control websocket:', err)
  })

  ws.addEventListener('close', () => {
    log.error('WebSocket closed. Commands can not be sent.')
  })

  ws.addEventListener('open', () => {
    log.info('WebSocket connected.')

    const keyEventHandler = KeyEventHandler(ws)

    document.addEventListener('keydown', keyEventHandler)
    document.addEventListener('keyup', keyEventHandler)

    ;['Power', 'WakeUp', 'Sleep'].map(code => {
      const el = document.querySelector(`button#${code.toLowerCase()}`)

      el.addEventListener('mousedown', () => {
        log.info(`Pressing ${code} button...`)
        document.dispatchEvent(new KeyboardEvent('keydown', { code }))
      })

      el.addEventListener('mouseup', () => {
        log.info(`${code} button released.`)
        document.dispatchEvent(new KeyboardEvent('keyup', { code }))
      })
    })
  })
}

function KeyEventHandler (ws: WebSocket) {
  return function handleKeyEvent (e: KeyboardEvent) {
    const getBytes = e.type === 'keyup' ? getBreakBytes : getMakeBytes
    let ps2Command

    try {
      ps2Command = getBytes(e.code)
    } catch (err) {
      log.warn('Error getting scancode for key', e.code, err)
      return
    }

    const frame: CommandFrame = {
      type: 'ps2-command',
      ps2Command
    }

    ws.send(JSON.stringify(frame))

    e.preventDefault()
  }
}
