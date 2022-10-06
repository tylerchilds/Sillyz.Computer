import { Quill, tag } from "/deps.js"

import { customEvents, toolbarOptions } from './designer.js'

const flags = {
  fid: 'https://1998.social/ffs' + window.location.pathname
}

const $ = tag('hypertext')
$.render(wysiwyg)
export default $

async function download(target, $, flags) {
  const { val={} } = (
    await new Promise(res => bus.get_once(flags.fid, res))
  ) || {}

  target.quill.setContents({})
  target.quill.clipboard.dangerouslyPasteHTML(0, (val && val.file) || "<p><highlighter><em>What's on your mind...<em></highlighter></p><p>Tell me...</p>");
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

