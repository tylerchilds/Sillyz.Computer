import tag from 'http://localhost:4507/mod.js';

import Quill from 'https://esm.sh/quill@1.3.7'
import { customEvents, toolbarOptions } from './designer.js'

const flags = {
  fid: window.location.protocol + '//' + window.location.host + '/ffs' + window.location.pathname
}

const $ = tag('hypertext')
$.render(wysiwyg)
export default $

async function download(target, $, flags) {
  const value = await fetch(flags.fid)
    .then(res => {
      if(res.status !== 200) throw new Error()
      return res.text()
    })
    .catch(console.log)

  target.quill.setContents({})
  target.quill.clipboard.dangerouslyPasteHTML(0, value || "<p><highlighter><em>What's on your mind...<em></highlighter></p><p>Tell me...</p>");
}

function wysiwyg(target) {
  if(target.quill) return

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
  target.quill.on('editor-change', update(target))
  download(target, $, flags)

  if(toolbarContainer) target.appendChild(toolbarContainer)
	customEvents(target.quill, $)
}

function update(target) {
  return function updateEditor() {
    const quillDelta = target.quill.getContents()
    const rawHTML = target.quill.root.innerHTML

    $.write({
      [flags.fid]: { quillDelta, rawHTML }
    })
  }
}

$.style(`
	& {
		display: grid;
	}
`)

