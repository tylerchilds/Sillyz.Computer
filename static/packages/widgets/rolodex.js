import { tag, signal } from "/deps.js"
import '/packages/tags/chalect-bar.js';
import $user from "/packages/widgets/menu-user.js"

const $ = tag('rolodex')
$.render(target => {
  const {
    _link,
    rolodex = [],
  } = $user.read()

  const lists = rolodex
    .map(({ value }) => (signal(value) || {}))
    .reduce((all, x) => {
      if(x.lists) {
        const lists = Object.assign([], x.lists);
        all = [...all, ...lists]
      }
      return all
    }, [])

  return `
    <div style="max-width: 70ch; margin: auto;">
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
  return items.map(({alt, src }, i) => {
    return `
      <div class="item ${i===0 ?'slide-in':''}">
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
    height: 100%;
  }

  & .list {
    aspect-ratio: 1/1;
    position: relative;
		display: grid;
    grid-template-areas: 'stage';
	}

  & .item {
    grid-area: stage;
    background: white;
    box-sizing: border-box;
    overflow: auto;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    opacity: 0;
    pointer-events: none;
    --size-small: scale(1);
    --size-normal: scale(1);
    --offset-right: translate(0, 0);
    --offset-none: translate(0, 0);
    --offset-left: translate(0, 0);
    transform: var(--size-small) var(--offset-right);
  }


  & .item.slide-in {
    --offset-direction: var(--offset-right);
    animation: &-slide 500ms ease-in-out forwards;
  }

  & .item.slide-out {
    --offset-direction: var(--offset-left);
    animation: &-slide 500ms ease-in-out reverse forwards;
  }

  & .item.slide-in-back {
    --offset-direction: var(--offset-left);
    animation: &-slide 500ms ease-in-out forwards;
  }

  & .item.slide-out-back {
    --offset-direction: var(--offset-right);
    animation: &-slide 500ms ease-in-out reverse forwards;
  }

  @keyframes &-slide {
    0% {
      transform:
        var(--size-small)
        var(--offset-direction);
      opacity: 0;
      filter: blur(3px);
    }

    33% {
      transform:
        var(--size-small)
        var(--offset-direction);
    }

    66% {
      transform:
        var(--size-small)
        var(--offset-none);
    }

    100% {
      transform:
        var(--size-normal)
        var(--offset-none);
      opacity: 1;
      pointer-events: initial;
      filter: blur(0);
    }
  }
`)
