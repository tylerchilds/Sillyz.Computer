import { tag } from "/deps.js"

export function stitch(plugins = []) {
  plugins.map(url => import(url).then(({plugin}) => load(plugin())))
}

function load(manifest = {}) {
  const flags = manifest.flags || {}

  const $ = tag(manifest.name);

  if(manifest.render) {
    import(manifest.render._link)
      .then(({ compositor }) => {
        $.render(target => compositor(target, $, flags))
      })
  }

  if(manifest.events) {
    manifest.events.with.map((x, i) => {
      import(x._link)
        .then(({ macro }) => {
          const { is, type } = manifest.events.with[i]
          $.on(type, is, (event) => macro(event, $, flags))
        })
    })
  }
}
