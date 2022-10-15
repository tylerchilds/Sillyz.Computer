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
    const minorIndex = mod(majorIndex + 4, minorScale.length)
    const minorNote = minorScale[minorIndex]

    const majorColor = colors[majorIndex][octave].name
    const minorColor = colors[minorIndex][octave].name

    return `
      <div class="group" style="transform: rotate(${majorIndex * 30}deg)">
        <div>
          ${majorNote}
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
        <div>
          ${minorNote}
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
    grid-template-rows: repeat(4, 1fr);
    clip-path: polygon(23% 0%, 50% 100%, 77% 0%);
    gap: 5px;
  }
  & .step {
    touch-action: manipulation;
    border: none;
    width: 100%;
    height: auto;
  }
`)

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

