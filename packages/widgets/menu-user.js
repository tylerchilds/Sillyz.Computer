/*
  TODO: There's a bug where this doesn't trigger on secondary toggles so we gotta figure that out
*/
import tag from 'https://deno.land/x/tag@v0.2.0/mod.js';

import * as focusTrap from 'https://esm.sh/focus-trap';

const $ = tag('menu-user')

function toggle({ target }) {
  const { active } = $.read()
  focustrap(target, !active)
}

$.on('click', 'button', toggle)

$.render(target => {
  if(!target.trap) load(target)

  const { content, active } = $.read()

  return `
    <div class="user-menu-content ${active ? 'active' : ''}">
      ${content}
    </div>
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
    max-width: 3rem;
  }

  & button {
    justify-items: start;
    align-items: center;
    border: none;
    display: grid;
    gap: 12px;
    grid-template-columns: auto 1fr auto;
    padding: 0;
    width: 100%;
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
    width: 100%;
  }

  & .active {
    animation: &-fade-in 200ms ease-in-out;
    display: block;
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
  target.trap = focusTrap.createFocusTrap(target, {
    onActivate: activate,
    onDeactivate: deactivate,
    clickOutsideDeactivates: true
  });


  const content = await new Promise(resolve => {
    resolve(target.innerHTML)
  })

  const { active } = $.read()
  focustrap(target, active)
  $.write({ content })
}

function focustrap(target, active) {
  const { activate, deactivate } = target.closest($.selector).trap;
  active
    ? activate()
    : deactivate()
}

function activate(){
  console.log('a')
  $.write({ active: true })
}

function deactivate() {
  console.log('de')
  $.write({ active: false })
}
