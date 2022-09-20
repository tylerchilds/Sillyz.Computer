/*
  TODO: There's a bug where this doesn't trigger on secondary toggles so we gotta figure that out
*/
import tag from 'https://deno.land/x/tag@v0.3.2/mod.js';
import { popover } from '/packages/ui/popover.js';

const $ = tag('menu-user')

function userMenu() {
  const { content } = $.read()
  popover(event, `
    <div class="user-menu-content">
      ${content}
    </div>
  `)
}

$.on('click', 'button', userMenu)

$.render(target => {
  if(!target.ready) load(target)

  return `
    <button>
      <img src="https://tychi.me/professional-headshot.jpg" alt="Professional photo of Ty" />
    </button>
  `
})

$.style(`
  & {
    display: inline-block;
    position: relative;
  }

  & img {
    border-radius: 100%;
    width: 40px;
    height: 40px;
  }

  & button {
    justify-items: start;
    align-items: center;
    border: none;
    display: grid;
    gap: 12px;
    grid-template-columns: auto 1fr auto;
    padding: 0 !important;
    width: 100% !important;
    height: auto !important
  }

  & a {
    display: block;
  }

  & button * {
    pointer-events: none;
  }

  & .user-menu-content {
    background: white;
    border-radius: 4px;
    display: none;
    position: absolute;
    right: 0;
    top: -12px;
    transform: translateY(-100%);
    animation: &-fade-in 200ms ease-in-out;
    width: 100%;
  }

  & .menu-item {
    border-bottom: 1px solid rgba(128, 128, 128, .4);
    padding: 8px 12px;
  }

  & .menu-item:last-child {
    border-bottom: none;
  }

  @keyframes &-fade-in {
    0% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }
`)

// asyncronously load a pane on first render
async function load(target) {
  target.ready = true
  const content = await new Promise(resolve => {
    resolve(target.innerHTML)
  })

  console.log(content)
  $.write({ content })
}

function activate(){
  console.log('a')
  $.write({ active: true })
}

function deactivate() {
  console.log('de')
  $.write({ active: false })
}
