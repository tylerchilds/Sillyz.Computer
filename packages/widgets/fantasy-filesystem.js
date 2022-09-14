import tag, { read } from 'http://localhost:4507/mod.js';

const flags = {
  fid: window.location.protocol + '//' + window.location.host + '/ffs' + window.location.pathname
}

const $ = tag('fictional-filesystem')

$.render(target => {
  const { secret } = $.read()

  return `
    <h2>Save Content</h2>
    <form>
      <label for"secret">Secret</label>
      <input type="text" name="secret" value="${secret || ''}" placeholder="Secret..." />
      <button type="submit">Save</button>
    </form>
  `
})

$.on('change', '[type="text"]', (event) => {
  const { name, value } = event.target
  $.write({ [name]: value })
})

$.on('submit', 'form', (event) => {
  event.preventDefault()
  const { secret } = $.read()
  const content = getContents(event.target)

  upload('save', content)
})

function getContents(target) {
  const resource = target.closest($.selector);
  const model = resource.getAttribute('model')

  const data = read(model)[flags.fid] || {}

  return contentsByType(model, data)
}

const contentsLookup = {
  hypertext: (x) => x.rawHTML
}

function contentsByType(model, data) {
  const lookup = contentsLookup[model] || (() => null)
  return lookup(data)
}

async function upload(mode, value) {
  if(value) {
    const response = await fetch(flags.fid, {
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
