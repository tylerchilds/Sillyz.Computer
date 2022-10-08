export function macro(event, $, flags) {
  const { name, value } = event.target
  const { index } = event.target.dataset
  const plugin = event.target.closest($.selector).getAttribute('plugin')

  update(plugin, { name, index, value })
}

export default function update(plugin, args) {
  const state = { ...bus.cache[plugin].val }
  bus.state[plugin] = {
    ...state,
    file: {
      ...state.file,
      events: {
        ...state.file.events,
        with: [
          ...state.file.events.with.map((item, i) => {
            if(`${i}` !== args.index) {
              return item
            }

            return {
              ...item,
              [args.name]: args.value
            }
          })
        ]
      }
    }
  }
}
