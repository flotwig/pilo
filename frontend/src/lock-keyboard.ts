import log from './log'

export function lockKeyboard() {
  log.info('Attempting to lock keyboard...')
  return Promise.resolve()
  .then(() => {
    // @ts-ignore
    return navigator.keyboard.lock()
  })
  .then(() => log.info('Successfully locked keyboard.'))
  .catch((err) => log.warn('Failed to lock keyboard. Some keys may not be captured.', err))
}
