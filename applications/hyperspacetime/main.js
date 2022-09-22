import tag from 'https://deno.land/x/tag@v0.3.2/mod.js';
import "/packages/widgets/menu-user.js"
import "/packages/widgets/menu-resource.js"
import "/packages/widgets/fantasy-filesystem.js"

import "/packages/tags/highlighter.js"
import "/packages/tags/variable-text.js"

import "/packages/ui/tooltip.js"
import "/packages/streams/instrument.js"
import Color from "https://esm.sh/colorjs.io@0.4.0";


const flags = {
  fid: window.location.protocol + '//' + window.location.host + '/ffs' + window.location.pathname
}

const $ = tag('hyperspacetime')
const $HCW = tag('HyperColorWheel', {
  colors: [],
  start: 0,
  length: 360,
  reverse: false
})


$.render(() => {
  return `
    <z-instrument></z-instrument>
    <HyperColorWheel></HyperColorWheel>
    grapevine
  `
})

const lightnessStops = [
  [5, 30],
  [20, 45],
  [35, 60],
  [50, 75],
  [65, 90],
  [80, 105],
  [95, 120]
]

$HCW.write({ colors: recalculate() })
$HCW.render(() => {
  const { start, length, reverse, colors } = $HCW.read()
  const wheel = colors.map((lightness, i) => {
    const steps = lightness.map((x) => `
      <button class="step" style="background: var(${x.name})">
        [${x.block}, ${x.inline}]
      </button>
    `).join('')
    return `
      <div class="group" style="transform: rotate(${i * 30}deg)">
        ${steps}
      </div>
    `
  }).join('')

  return `
    <div class="wheel">
      ${wheel}
    </div>
    <form>
      ${start} ${length} ${reverse}
      <input min="0" max="360" value="${start}" name="start" type="range" />
      <input min="0" max="360" value="${length}" name="length" type="range" />
      <input name="reverse" type="checkbox" />
      <label for="reverse">Reverse</label>
    </form>
    <style>
      :root {
        ${printVariables()}
      }
    </style>
  `
})

$HCW.style(`
  & .wheel {
    display: grid;
    grid-template-areas: "slot";
    grid-template-rows: 40vmin;
    grid-template-columns: 40vmin;
    place-content: start center;
    padding: 10vmin;
    height: 80vmin;
  }
  & .group {
    grid-area: slot;
    transform-origin: bottom;
    display: grid;
    grid-template-columns: 1fr;
    grid-template-rows: repeat(7, 1fr);
    clip-path: polygon(23% 0%, 50% 100%, 77% 0%);
  }
  & .step {
    border: none;
    width: 100%;
    height: auto;
  }
`)

function printVariables() {
  const { colors } = $HCW.read()
  return colors.flatMap(x => x).map(({ name, value }) => `
    ${name}: ${value};
  `).join('')
}

function recalculate() {
  const { start, length, reverse } = $HCW.read()

  return [...Array(12)].map((_, hueIndex) => {
    const step = ((length / 12) * hueIndex)
    const hue = reverse
      ? start - step
      : start + step

    return lightnessStops.map(([l, c], i) => {
      const name = `--wheel-${hueIndex}-${i}`
      const value = new Color('lch', [l, c, hue])
        .display()
        .toString()

      return {
        name,
        value,
        block: hueIndex,
        inline: i
      }
    })
  })
}

$HCW.on('change', '[type="range"]', (event) => {
  const { value, name } = event.target

  $HCW.write({ [name]: parseInt(value), colors: recalculate() })
})

$HCW.on('change', '[type="checkbox"]', (event) => {
  const { checked, name } = event.target

  $HCW.write({ [name]: checked, colors: recalculate() })
})


export default $

$.style(`
	& {
		display: grid;
	}
`)

