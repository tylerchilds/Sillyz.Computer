import tag from 'https://deno.land/x/tag@v0.2.0/mod.js';
import Quill from 'https://esm.sh/quill@1.3.7'
import { customEvents, toolbarOptions } from './designer.js'

const flags = {
  path: window.location.pathname,
  hostname: window.location.hostname,
}

const shape = {
  quillDelta: {},
  rawHTML: ""
}

const $ = tag('hypertext')
$.render(wysiwyg)
export default $

function shapeById($, id) {
  return $.read()[id] || shape
}

function wysiwyg(target) {
  if(target.quill) return

  const { quillDelta } = shapeById($, flags.path)

  const toolbarContainer = target.querySelector('.toolbar-container')

  const quillOptions = {
    theme: 'wozniak',
    modules: {
      toolbar: {
        container: toolbarContainer || toolbarOptions,
      }
    }	
  }

  target.quill = new Quill(target, quillOptions)

  target.quill.setContents(quillDelta)
  target.quill.on('editor-change', update(target))

  if(toolbarContainer) target.appendChild(toolbarContainer)
	customEvents(target.quill, $)
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

