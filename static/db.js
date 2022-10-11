import '/deps.js'
bus.state['https://1998.social/files/compositors/hello.js'] = { file:`export function compositor(target, $, flags) {

  return '<button>click</button>'

}`}

bus.state['https://1998.social/files/no-code.html'] = { file: `
<div style="display: grid; grid-template-columns: 1fr 1fr;">
  <no-code></no-code>
  <proof-of-admin plugin="https://1998.social/files/plugins/no-code.json"></proof-of-admin>
</div>

<script type='module'>
  import {stitch} from '/packages/lib/stitch.js';
  stitch([
    '/files/plugins/no-code.json',
    '/plugins/proof-of-admin.json'
  ])
</script>
`}

bus.state['https://1998.social/files/macros/hello.js'] = { file: `export function macro(event, $, flags) {

  alert('clicked')

}`}

bus.state['https://1998.social/files/plugins/no-code.json'] = {
  file: {
    "name":"no-code",
    "render": {
      "_link": "/files/compositors/hello.js"
    },
    "styles": {
      "with": [{
        "_link": "/files/styles/hello.json"
      }]
    },
    "events": {
      "with": [{
        "type": [{id: "click", value: "click"}],
        "is": "button",
        "_link": "/files/macros/hello.js"
      }]
    }
  }
}

bus.state['https://1998.social/files/proof-of-concept.html'] = { file: `
  <proof-of-concept></proof-of-concept>
  <script type='module'>
    import {stitch} from '/packages/lib/stitch.js';
    stitch(['/plugins/proof-of-concept.json'])
  </script>
`}

fetch('/enums/events')
  .then(x => x.json())
  .then(enums =>
    bus.state['https://1998.social/enums/events'] = { enums }
  )
