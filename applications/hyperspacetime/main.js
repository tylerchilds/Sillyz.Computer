import tag from 'https://deno.land/x/tag@v0.3.2/mod.js';
import "/packages/widgets/menu-user.js"
import "/packages/widgets/menu-resource.js"
import "/packages/widgets/fantasy-filesystem.js"

import "/packages/tags/highlighter.js"
import "/packages/tags/variable-text.js"

import "/packages/ui/tooltip.js"
import "/packages/streams/colorwheel.js"

const flags = {
  fid: window.location.protocol + '//' + window.location.host + '/ffs' + window.location.pathname
}

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

