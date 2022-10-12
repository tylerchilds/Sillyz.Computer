import { tag } from "/deps.js"

const $ = tag('ctx-toolbar', { body: null })

export default $

$.render(() => $.read().body)

export function setToolbar(body) {
  $.write({
    body
  })
}

const context = `<ctx-toolbar></ctx-toolbar>`
document.body.insertAdjacentHTML("beforeend", context)
$.style(`
  & {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 2;
  }
`)

