import log from './log'
export function startVideo() {
  log.info('Connecting to video...')

  const videoImg = document.querySelector('#video')

  videoImg.addEventListener('error', () => {
    log.error('Error connecting to MJPEG stream. Is the video server running?')
  })

  videoImg.addEventListener('loadeddata', () => {
    log.info('Video is now connected.')
  })

  videoImg.setAttribute('src', 'video.mjpeg')
}
