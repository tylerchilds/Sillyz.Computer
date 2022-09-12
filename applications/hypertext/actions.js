export default function actions(target, $, flags) {
  target.innerHTML = `
    <button data-recover data-id="${flags.path}">
      Recover
    </button>
    <button data-view data-id="${flags.path}">
      View
    </button>
    <div style="float: right">
      ${safePublish($, flags)}
    </div>
  `

  //syncDirectories($, flags)


  return {
    subscriber: function() {
      console.log(target)
    }
  }
}

function safePublish(_$, flags) {
  return `
    <button data-publish data-id="${flags.path}">
      Publish
    </button>
  `
}

async function upload(mode, $, flags) {
  const currentState = $.read()
  const { value } = currentState[flags.path] || {}

  if(value) {
    // persist to some back up location
    const response = await fetch(flags.path, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        mode,
        value
      })
    });

    console.log(response)
  }
}

function persist($, flags) {
  return (transaction) => {
    if(transaction.changes.inserted.length < 0) return

    const { view } = editors[flags.path]
    const value = view.state.doc.toString()
    view.update([transaction])
    $.write({ [flags.path]: { value }})
  }
}

function view(_$, flags) {
  window.open(flags.path, '_blank')
}

function each($, save) {
  return [...document.querySelectorAll($.selector)].map(save)
}

function onAutosave($, flags) {
  setInterval(() => each($, () => {
    autosave($, flags)
  }), flags.every * 1000)
}

function onPublish($, flags) {
  $.on('click', '[data-publish]', () => {
    publish($, flags)
  })
}

function onRecover($, flags) {
  $.on('click', '[data-recover]', () => {
    recover($, flags)
  })
}

function onView($, flags) {
  $.on('click', '[data-view]', () => {
    view($, flags)
  })
}

function syncDirectories($, flags) {
  poll()

  async function poll() {
    const { paths } = await fetch('/status')
      .then(res => res.json())

    $.write({ paths })
  }

  setInterval(poll, flags.syncInterval)
}
