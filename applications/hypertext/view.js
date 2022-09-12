import { editorById } from './utils.js'

export default function view(target, $, flags) {
  const iframe = document.createElement('iframe')
  target.appendChild(iframe)

  return {
    subscriber: function() {
      const { rawHTML } = editorById($, flags.path)
      let value = rawHTML

      if(!value) return

      const singleQuote = `'${window.location.origin}/`
      const doubleQuote = `"${window.location.origin}/`

      value = value.replace(/'\//g, singleQuote)
      value = value.replace(/"\//g, doubleQuote)

      const blob = new Blob([value], { type: 'text/html' });
      const href = URL.createObjectURL(blob);

      iframe.src = href
    }
  }
}
