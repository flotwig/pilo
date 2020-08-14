const logUl = document.querySelector('#log')

const logFn = (level: keyof Console, icon: string) => (...args) => {
  console[level](...args)
  const li = document.createElement('li')
  const now = new Date()
  li.innerHTML = `<time datetime="${now.toString()}">${now.toTimeString().split(' ')[0]}</time> <span class="icon">${icon}</span> ${args.map(String).join(' ')}`
  li.setAttribute('class', `${level}`)
  // logUl.appendChild(li)
  logUl.prepend(li)
}

export const info = logFn('info', 'ℹ')
export const error = logFn('error', '❌')
export const warn = logFn('warn', '⚠')

export default { info, error, warn }
