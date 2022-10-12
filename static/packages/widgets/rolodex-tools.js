import { tag, signal } from "/deps.js"
import '/packages/tags/chalect-bar.js';
import $user from "/packages/widgets/menu-user.js"

const $ = tag('rolodex-tools')
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
    <button>create</button>
    <chalect-bar
      src="${_link}#rolodex"
      options="${_link}#collections"
    ></chalect-bar>
    <button>remix</button>
  `
})
$.style(`
  & {
    display: grid;
    grid-template-columns: auto 1fr auto;
    place-items: center;
  }
`)
