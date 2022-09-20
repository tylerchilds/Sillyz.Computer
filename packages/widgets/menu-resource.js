import tag from 'https://deno.land/x/tag@v0.3.2/mod.js';

import { showModal, hideModal } from '/packages/ui/modal.js'

const $ = tag('menu-resource')

function resourceMenu({ target }) {
  const resource = target.closest($.selector);

  const model = resource.getAttribute('model')
  const view = resource.getAttribute('view')

  showModal(`<${view} model="${model}"></${view}>`)
}

$.on('click', 'button', resourceMenu)

$.render(target => {
  return `
    <button>
      ...
    </button>
  `
})


