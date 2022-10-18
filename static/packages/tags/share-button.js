import "/packages/tags/rainbow-button.js"
import "/packages/tags/qr-code.js"
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

$.on('click', 'button', function copy() {
  const { origin, search, pathname } = window.location

  const url = `${origin}${search}${pathname}`;

	showModal(`
		<qr-code url="${url}"></div>
		<a href="${url}">Regular Link</a>
	`)
})
