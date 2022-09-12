import tag from 'https://deno.land/x/tag@v0.2.0/mod.js';
import Quill from 'https://esm.sh/quill@1.3.7'
import { shapeById } from './utils.js'

const flags = {
  path: window.location.pathname,
  hostname: window.location.hostname,
}

const $ = tag('hypertext')

$.render(wysiwyg)

function wysiwyg(target) {
  if(!target.quill) initialize(target, $, flags)
}

function initialize(target, $, flags) {
  const { quillDelta } = shapeById($, flags.path)

  target.quill = new Quill(target, { theme: 'snow' })
  target.quill.setContents(quillDelta)
  target.quill.on('editor-change', update(target))
}

function update(target) {
  return function updateEditor() {
    const quillDelta = target.quill.getContents()
    const rawHTML = target.quill.root.innerHTML

    $.write({
      [flags.path]: { quillDelta, rawHTML }
    })
  }
}

$.style(`
	& {
		display: grid;
	}
`)
