import { tag, signal } from "/deps.js"

const $ = tag('loloco')

$.render(target => {
  const args = attributes(target, $)

  const {
    label,
    lists
  }  = signal(args.resource)

  if(!label) return

  return `
    <div style="max-width: 70ch; margin: auto;">
      ${label}
      ${renderLists(lists)}
    </div>
  `
})

function renderLists(lists = []) {
  return lists.map(({label, items}) => {
    return `
      ${label}
      ${renderItems(items)}
    `
  }).join('')
}

function renderItems(items = []) {
  return items.map(({alt, src }) => {
    return `
      <div style="aspect-ratio: 1/1; max-inline-size: 100; margin: auto;">
        ${alt}
        ${renderFile(src)}
      </div>
    `
  }).join('')
}

function renderFile(src = '') {
  return `
    <iframe
      sandbox="allow-scripts allow-same-origin"
      src="${src}"
      style="width: 100%; height: 100%; border: none;"
    ></iframe>
  `
}

function attributes(node, $) {
  const target = node.closest($.selector)

  const link = target.getAttribute('link');
  const [resource, path] = link.split('#');

  return {
		root: target,
    resource,
    path
  }
}


