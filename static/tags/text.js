import tag from 'https://deno.land/x/tag@v0.2.0/mod.js';
//debugger

const defaults = {
  monospace: '0',
  casual: '.5',
  weight: '400',
  slant: '0',
  cursive: '.5',
}
const $ = tag('text')

$.render((target) => {
  if(!target.initialized) {
    setTimeout(
      () => mount(target, ['monospace', 'casual', 'weight', 'slant', 'cursive']
    ), 1)
    target.initialized = true
  }

  const {
    monospace,
    casual,
    weight,
    slant,
    cursive
  } = $.read()[target.id] || defaults

  target.style= `
    --v-font-mono: ${monospace};
    --v-font-casl: ${casual};
    --v-font-wght: ${weight};
    --v-font-slnt: ${slant};
    --v-font-crsv: ${cursive};
  `
});

function mount(target, values) {
  values.map(x => {
    $.write({
      [x]: target.getAttribute(x) || defaults[x]
    }, merge(target.id))
  })
}

function merge(id) {
  return (state, payload) => ({
    ...state,
    [id]: {
      ...state[id],
      ...payload
    }
  })
}
