import { tag, signal, focusTrap } from '/deps.js'
import set from 'https://esm.sh/lodash@4.17.21/set'
import get from 'https://esm.sh/lodash@4.17.21/get'

const $ = tag('chalect-bar', {
  filter: ''
})

$.on('click', '.item', function update(event) {
  event.preventDefault();
  const { id } = event.target.dataset
  const args = attributes(event.target, $)
  const state = { ...bus.cache[args.resource].val }

  const { enums = [] }  = signal(args.options) || {}

	const value = enums.find(x => x.id === id) || {
		id,
		value: id
	}

  set(state, args.path, [value])

  bus.state[args.resource] = state

		args.root.trap.deactivate();
})

$.on('click', '.bar', toggleActive);
$.on('keyup', '[name="filter"]', setFilter);

$.render(target => {
	if(!target.trap) {
		target.trap = focusTrap.createFocusTrap(target, {
			onActivate: onActivate(target),
			onDeactivate: onDeactivate(target),
			clickOutsideDeactivates: true
		});
	}

  const args = attributes(target, $)

  const { filter } = $.read()

  const { enums = [] }  = signal(args.options) || {}
  const data  = signal(args.resource) || {}

  const choices = get(data, args.path, [])

  const list = enums
    .filter(x => x.value.toLowerCase().indexOf(filter.toLowerCase()) > -1)
    .map(x => `
      <button class="item" data-id="${x.id}">
        ${x.value}
      </button>
    `).join('')

  return `
    <button class="bar">
      ${args.label ? args.label : ''} ${choices.map(x => x.value).join(', ')}
    </button>

    <div class="filterable-list">
      <div class="filter-area">
        <input type="text" name="filter" placeholder="Search" value="${filter}" />
      </div>
      <div class="list">
        ${list}
				<button class="item" data-id="${filter}">
					${filter}
				</button>
      </div>
    </div>
  `
})

function attributes(node, $) {
  const target = node.closest($.selector)

  const src = target.getAttribute('src');
  const [resource, path] = src.split('#');

  return {
		root: target,
    options: target.getAttribute('options'),
    label: target.getAttribute('label'),
    resource,
    path
  }
}

function toggleActive(event) {
  const args = attributes(event.target, $)

	if(args.root.matches('.is-active')) {
		args.root.trap.deactivate();
	} else {
		args.root.trap.activate();
	}
}


function setFilter(event) {
	const { value } = event.target
	$.write({ filter: value })
}

function onActivate(target){
  return () => {
    target.classList.add('is-active')
    target.querySelector('[name="filter"]').focus()
  }
}

function onDeactivate(target) {
  return () => {
    target.classList.remove('is-active')
		$.write({ filter: '' })
  }
}
$.style(`
	& {
		display: inline-block;
		position: relative;
		z-index: 3;
	}

	& .filter-area {
		display: grid;
		grid-template-columns: auto 1fr;
		align-items: center;
	}

	& .bar {
		white-space: nowrap;
	}

	&.is-active .bar {
		background: blue;
	}
	& .bar:hover,
	& .bar:focus {
		border-color: blue;
	}

	& [name="filter"] {
		background: transparent;
		border: none;
		width: 100%;
	}

	& .filterable-list {
		background: white;
		display: none;
		position: absolute;
	}

	&.is-active .filterable-list {
		display: block;
	}

	& .item {
		background: transparent;
		border: none;
		display: grid;
		grid-template-columns: auto 1fr;
		align-items: center;
		min-height: 40px;
		margin: 0;
		text-align: left;
		width: 100%;
	}

	& .item * {
		pointer-events: none;
	}

	& .list {
		max-height: 80vh;
		overflow-y: auto;
	}

	& .item:hover,
	& .item:focus {
		background: blue;
	}
`)
