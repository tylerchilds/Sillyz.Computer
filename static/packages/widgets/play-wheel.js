import { Color, tag, signal } from "/deps.js"
import * as Tone from "https://esm.sh/tone@next"
import { playNote } from "/packages/streams/instrument.js"
import $user from "/packages/widgets/menu-user.js"

const synth = new Tone.Synth().toDestination()

const $ = tag('play-wheel', {
  colors: [],
  start: 0,
  length: 360,
  octave: 4,
  reverse: false
})

const majorScale = [
  'C', 'G', 'D', 'A', 'E', 'B', 'F#', 'Db', 'Ab', 'Eb', 'Bb', 'F'
]

const minorScale = [
  'a', 'e', 'b', 'f#', 'c#', 'g#', 'd#', 'bb', 'f', 'c', 'g', 'd'
]

const lightnessStops = [
  [5, 30],
  [20, 45],
  [35, 60],
  [50, 75],
  [65, 90],
  [80, 105],
  [95, 120]
]

$.write({ colors: recalculate() })
$.render(() => {
  const { start, length, reverse, colors, octave, debug } = $.read()
  const wheel = majorScale.map((majorNote, majorIndex) => {
    const minorNote = minorScale[majorIndex]
    const minorScaleIndex = mod(majorIndex + 3, minorScale.length)

    const majorColorIndex = mod(majorIndex * 7, colors.length)
    const minorColorIndex = mod(minorScaleIndex *7, colors.length)

    const majorColor = colors[majorColorIndex][octave].name
    const minorColor = colors[minorColorIndex][octave].name

    const majorLabelClass = majorNote.length === 2 ? 'label half' : 'label'
    const minorLabelClass = minorNote.length === 2 ? 'label half' : 'label'

    return `
      <div class="group" style="transform: rotate(${majorIndex * 30}deg)">
        <div class="${majorLabelClass}">
          <label>
            ${majorNote}
          </label>
        </div>
        <button
          class="step"
          data-octave="${octave}"
          data-note="${majorNote}"
          style="background: var(${majorColor})">
        </button>
        <button
          class="step"
          data-octave="${octave}"
          data-note="${minorNote}"
          style="background: var(${minorColor})">
        </button>
        <div class="${minorLabelClass}">
          <label>
            ${minorNote}
          </label>
        </div>
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
      play-wheel form {
        display: ${debug ? 'block' : 'none'}
      }
    </style>
  `
})

$.style(`
  & .wheel {
    display: grid;
    grid-template-areas: "slot";
    grid-template-rows: 45vmin;
    grid-template-columns: 40vmin;
    place-content: start center;
    padding: 1rem;
    height: 90vmin;
  }
  & .group {
    grid-area: slot;
    transform-origin: bottom;
    display: grid;
    grid-template-columns: 1fr;
    grid-template-rows: 2em 1fr 1fr 2em 1fr;
    clip-path: polygon(20% 0%, 50% 100%, 80% 0%);
    place-content: center;
    gap: 1px;
  }
  & .step {
    touch-action: manipulation;
    border: none;
    width: 100%;
    height: auto;
  }

  & .label {
    padding: .5em;
    width: 100%;
    background: white;
    color: black;
    display: grid;
  }

  & .label.half {
    background: black;
    color: white;
  }


  & .label:first-child label {
    place-self: end center;
  }

  & .label:last-child label {
    place-self: start center;
  }

  ${invertedLabels()}
`)

function invertedLabels() {
  const rulesets = []
  for(let i = 1; i < 360; i++) {
    rulesets.push(`
      & [style*="rotate(${i}deg)"] label {
        transform: rotate(${-1 * i}deg);
      }
    `)
  }
  return rulesets.join('')
}

function print(colors) {
  return colors.flatMap(x => x).map(({ name, value }) => `
    ${name}: ${value};
  `).join('')
}

function recalculate() {
  const { start, length, reverse } = $.read()

  const colors = [...Array(12)].map((_, hueIndex) => {
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

  if($user.read()._link) signal($user.read()._link).colorVariables = print(colors)

  return colors
}


const eventMap = {
  37: () => $.write({ start: $.read().start - 30}),
  39: () => $.write({ start: $.read().start + 30}),
};

document.addEventListener('keydown', (event) => {
  const handler = eventMap[event.keyCode] || console.log
  handler()
  $.write({ colors: recalculate() })
});


$.on('change', '[type="range"]', (event) => {
  const { value, name } = event.target

  $.write({ [name]: parseInt(value), colors: recalculate() })
})

$.on('change', '[type="checkbox"]', (event) => {
  const { checked, name } = event.target

  $.write({ [name]: checked, colors: recalculate() })
})

$.on('click', '.step', (event) => {
  const { note, octave } = event.target.dataset

  synth.triggerAttackRelease(`${note}${octave}`, "8n", Tone.now());
})

function mod(x, n) {
  return ((x % n) + n) % n;
}

