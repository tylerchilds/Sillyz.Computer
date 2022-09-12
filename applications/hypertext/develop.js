import {
  EditorState,
  EditorView,
  basicSetup
} from "https://esm.sh/@codemirror/basic-setup"
import {
  css
} from "https://esm.sh/@codemirror/lang-css"
import {
  html
} from "https://esm.sh/@codemirror/lang-html"
import {
  javascript
} from "https://esm.sh/@codemirror/lang-javascript"

import { editorById } from './utils.js'

const editors = {}

const config = {
  extensions: [
    basicSetup,
    html(),
    css(),
    javascript(),
    EditorView.lineWrapping
  ]
}

export default function develop(target, $, flags) {
  const { quillDelta, rawHTML, mode, value } = editorById($, flags.path)

  if(editors[flags.path]) return

  const state = EditorState.create({
    ...config,
    doc: rawHTML
  })

  const view = new EditorView({
    lineWrapping: true,
    dispatch: persist($, flags),
    parent: target,
    state
  })

  editors[flags.path] = {
    $,
    state,
    view,
  }

  return {
    subscriber: function() {
      const { rawHTML } = editorById($, flags.path)
      const { view } = editors[flags.path]

      view.dispatch({
        changes: {
          from: 0,
          to: view.state.doc.toString().length,
          insert: rawHTML
        }
      })
      //$.write({ [flags.path]: { value }})
    }
  }
}

function persist($, flags) {
  return (transaction) => {
    if(transaction.changes.inserted.length < 0) return

    const { view } = editors[flags.path]
    const value = view.state.doc.toString()
    view.update([transaction])
    //$.write({ [flags.path]: { value }})
  }
}

