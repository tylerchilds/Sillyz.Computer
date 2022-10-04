import { tag } from "/deps.js"
import "/packages/widgets/menu-user.js"
import "/packages/widgets/menu-resource.js"
import "/packages/widgets/fantasy-filesystem.js"

import "/packages/tags/highlighter.js"
import "/packages/tags/variable-text.js"

import "/packages/ui/tooltip.js"
import "/packages/streams/colorwheel.js"

const $ = tag('hyperspacetime')

$.render(() => {
  return `
    <HyperColorWheel></HyperColorWheel>
    grapevine
  `
})

export default $

$.style(`
	& {
		display: grid;
	}
`)

