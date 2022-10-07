import { tag } from "/deps.js"

const $ = tag('live-code')

$.render(target => {
  const link = target.getAttribute('src')
  const data = bus.state[link]

  return `
  ${data.file}
  `
})
