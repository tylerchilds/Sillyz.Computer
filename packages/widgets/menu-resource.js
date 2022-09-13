import tag from 'https://deno.land/x/tag@v0.2.0/mod.js';

import { showModal, hideModal } from '/packages/ui/modal.js'

const $ = tag('menu-resource')

function resourceMenu({ target }) {
  showModal('resource')
}

$.on('click', 'button', resourceMenu)

$.render(target => {
  return `
    <button>
      modal
    </button>
  `
})


