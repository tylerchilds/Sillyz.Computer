import { tag } from "/deps.js"

import { showDrawer, hideDrawer, byDrawer } from '/packages/ui/drawer.js'

const $ = tag('menu-resource')

function resourceMenu({ target }) {
  const resource = target.closest($.selector);

  const model = resource.getAttribute('model')
  const view = resource.getAttribute('view')

  const { isOpen } = byDrawer('right')

  isOpen 
    ? hideDrawer('right')
    : showDrawer({ position: 'right', body: `<${view} model="${model}"></${view}>`})
}

$.on('click', 'button', resourceMenu)

$.render(target => {
  return `
    <button data-tooltip="Meta Menu">
      ?
    </button>
  `
})


$.style(`
  & img {
    border-radius: 100%;
  }

  & button {
    display: grid;
    place-items: center;
    border: .25em solid var(--wheel-1-5);
    border-radius: 100%;
    padding: 0;
    width: 5em;
    height: 5em;
  }
`)
