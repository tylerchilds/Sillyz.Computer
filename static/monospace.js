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
import kinda from "./kinda.js"

const flags = {}

const $ = kinda('.z-monospace')

mount($, flags)
onRecover($, flags)

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

function tree($, _flags) {
  const { paths } = $.read()
  const items = paths.map(x => `
    <li>
      <a href="${x.path}/edit">${x.name}</a>
    </li>
  `).join('')
  return `<ul>${items}</ul>`
}

function actions($, flags) {
  return `
    <button data-restart data-id="${flags.path}">
      Restart
    </button>
  `
}

function mount($, flags) {
  $.render((target) => {
    if(target.ready) return

    $.ready(() => {
      initialize(target, $, flags)
      target.ready = true
    })
  })
}

function initialize(target, $, flags) {
  // already initialized, quit
  if(editors[flags.path]) return

  layout($, flags)

  const z = document.createElement("div")
  z.classList.add('z-monospace')
  target.parentNode.replaceChild(z, target)

  z.innerHTML = `
    <nav class="navigation">
      ${actions($, flags)}
    </nav>
    <main class="code"></main>
    <section class="preview">
      <iframe></iframe>
    </section>
  `

  const initialState = $.read()
  const {
    value = target.innerHTML
  } = initialState[flags.path] || {}

  preview($, { value })

  const state = EditorState.create({
    ...config,
    ...flags,
    doc: value
  })

  const view = new EditorView({
    lineWrapping: true,
    dispatch: persist($, flags),
    parent: z.querySelector('.code'),
    state
  })

  editors[flags.path] = {
    $,
    state,
    view,
  }

  if(!value) {
    restart($, flags)
  }
}

function onRecover($, flags) {
  $.on('click', '[data-restart]', () => {
    restart($, flags)
  })
}


function persist($, flags) {
  return (transaction) => {
    if(transaction.changes.inserted.length < 0) return

    const { view } = editors[flags.path]
    const value = view.state.doc.toString()
    preview($, { value })
    view.update([transaction])
    $.write({ [flags.path]: { value }})
  }
}

function preview($, flags) {
  let { value } = flags
  if(!value) return

  const singleQuote = `'${window.location.origin}/`
  const doubleQuote = `"${window.location.origin}/`

  value = value.replace(/'\//g, singleQuote)
  value = value.replace(/"\//g, doubleQuote)

  const blob = new Blob([value], { type: 'text/html' });
  const href = URL.createObjectURL(blob);
  document.querySelector(`${$.selector} iframe`).src = href
}

function restart($, flags) {
  const value = ''
  const { view } = editors[flags.path]

  view.dispatch({
    changes: {
      from: 0,
      to: view.state.doc.toString().length,
      insert: value
    }
  })
  $.write({ [flags.path]: { value }})
}

function layout($, _flags) {
  const repl = `
    & {
      display: grid;
      grid-template-areas: "nav nav" "editor preview";
      grid-auto-columns: 1fr 1fr;
      grid-auto-rows: 2rem auto;
      height: calc(25vh + 2rem);
      max-width: 100%;
    }

    & .navigation {
      grid-area: nav;
    }

    & .code {
      grid-area: editor;
      overflow: auto;
    }

    & .preview {
      grid-area: preview;
    }

    & iframe {
      height: 100%; border: 0; width: 100%;
    }
  `

  $.style(repl)
}
