import { tag, signal } from "/deps.js"
import $user from "/packages/widgets/menu-user.js"

const $ = tag('rolodex')
$.render(target => {
  const {
    _link,
    rolodex = {},
  } = $user.read()

  const {
    label,
    lists
  }  = signal(rolodex.value) || {}

  if(!label) return

  return `
    <div style="max-width: 70ch; margin: auto;">
      <chalect-bar
        src="${_link}#rolodex"
        options="${_link}#collections"
      ></chalect-bar>
      ${renderLists(lists)}
    </div>
  `
})

function renderLists(lists = []) {
  return lists.map(({label, items}) => {
    return `
			${label}
			<div class="list">
        ${renderItems(items)}
      </div>
    `
  }).join('')
}

function renderItems(items = []) {
  return items.map(({alt, src }) => {
    return `
      <div class="item" style="aspect-ratio: 1/1; max-inline-size: 100; margin: auto;">
				<iframe
					title="${alt}"
					sandbox="allow-scripts allow-same-origin"
					src="${src}"
					style="width: 100%; height: 100%; border: none;"
				></iframe>
      </div>
    `
  }).join('')
}

$.style(`
  & {
    display: block;
  }

  & .list {
    position: relative;
		display: flex;
		scroll-snap-type: x mandatory;
		margin-bottom: 10px;
		max-width: 400px;
		overflow-x: scroll;
	}

	& .item {
		scroll-snap-align: start;
	}
`)
