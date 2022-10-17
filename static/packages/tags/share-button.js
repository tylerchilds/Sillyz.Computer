import "/packages/tags/rainbow-button.js"
import { tag } from "/deps.js"
import { showModal } from '/packages/ui/modal.js'

const $ = tag('share-button', { toasting: false })

$.render((target) => {
	const { toasting } = $.read()

  return `
	<rainbow-button>
		<button style="
			font-size: 6vmin;
			line-height: 1;
			padding: 3vmin 4vmin;
		">
			Share
		</button>
	</rainbow-button>

  `
})

$.on('click', 'button', async function copy() {
  const { origin, search, pathname } = window.location

  const url = `${origin}${search}${pathname}`;

	showModal(`
		<a href="${url}">Regular Link</a>
	`)
})
