module.exports = (on, config) => {
  const WebSocket = require('ws')

  on('task', {
    tryWsConnect ({ url, authSlug }) {
      const webSocket = new WebSocket(url, {
        perMessageDeflate: false,
        headers: {
          Authorization: `Basic ${Buffer.from(authSlug).toString('base64')}`,
        },
      })

      return new Promise((resolve, reject) => {
        webSocket.on('open', () => resolve())
        webSocket.on('error', (err) => reject(err))
      })
      .then(() => {
        return { succeeded: true }
      })
      .catch(err => {
        return { err: err.toString() }
      })
      .finally(() => {
        webSocket.close()
      })
    }
  })
}
