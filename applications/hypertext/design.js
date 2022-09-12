import Quill from 'https://esm.sh/quill@1.3.6'
import { editorById } from './utils.js'

export default function design(target, $, flags) {
  const { quillDelta, rawHTML, mode } = editorById($, flags.path)

  const quill = new Quill(target, { theme: 'bubble' })
  quill.setContents(quillDelta)
  quill.on('editor-change', update())

  function update() {
    return function updateEditor() {
      const quillDelta = quill.getContents()
      const rawHTML = quill.root.innerHTML

      $.write({
        [flags.path]: { quillDelta, rawHTML }
      })
    }
  }

  return {
    subscriber: function() {
      console.log(target)
    }
  }
}

