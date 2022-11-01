import '/deps.js'
bus.state['https://1998.social/files/compositors/hello.js'] = { file:`export function compositor(target, $, flags) {

  return '<button>click</button>'

}`}

bus.state['https://1998.social/files/no-code.html'] = {
  label: 'World',
  file: `
    <div style="display: grid; grid-template-columns: 1fr 1fr;">
      <no-code></no-code>
      <proof-of-admin plugin="https://1998.social/files/plugins/no-code.json"></proof-of-admin>
    </div>

    <script type='module'>
      import {stitch} from '/packages/lib/stitch.js';
      alert('ok')
      stitch([
        '/files/plugins/no-code.json',
        '/plugins/proof-of-admin.json'
      ])
    </script>
  `
}

bus.state['https://1998.social/files/hypercolorwheel.html'] = {
  label: 'World',
  file: `
    <link href="/styles/system.css" rel="stylesheet">
    <design-system></design-system>
    <hypercolorwheel></hypercolorwheel>
    <script type="module" src="/packages/tags/design-system.js"></script>
    <script type="module" src="/packages/streams/colorwheel.js"></script>
  `
}

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

bus.state['https://1998.social/rolodex/hello'] = {
  _link: 'https://1998.social/rolodex/hello',
  label: 'Hello',
  lists: [
    {
      label: 'Widgets',
      items: [
        {
          alt: 'Color Wheel',
          src: '/files/hypercolorwheel.html',
        },
        {
          alt: 'No Code',
          src: '/files/no-code.html',
        },
      ]
    },
    {
      label: 'Plugins',
      items: [
        {
          alt: 'Color Wheel',
          src: '/files/hypercolorwheel.html',
        },
        {
          alt: 'No Code',
          src: '/files/no-code.html',
        },
      ]
    }

  ]
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

fetch('/enums/post-types')
  .then(x => x.json())
  .then(enums =>
    bus.state['https://1998.social/enums/post-types'] = { enums }
  )

fetch('/edge/sillyz-spec.js')
  .then(x => x.text())
  .then(func =>
    bus.state['https://1998.social/edge/sillyz-spec.js'] = { func }
  )
