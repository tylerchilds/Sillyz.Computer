import { Color, tag, signal } from "/deps.js"
import * as Tone from "https://esm.sh/tone@next"
import $user from "/packages/widgets/menu-user.js"

const synths = [...new Array(24)].map(() =>
	new Tone.FMSynth().toMaster()
)

function attack(event) {
	event.preventDefault()
  const { note, octave, synth } = event.target.dataset
  synths[synth].triggerAttack(`${note}${octave}`, "2n");
	event.target.classList.add('active')
}

function release (event) {
	event.preventDefault()
  const { synth } = event.target.dataset
  synths[synth].triggerRelease();
	event.target.classList.remove('active')
}

const $ = tag('play-wheel', {
  colors: [],
  start: 120,
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
  const wheel = majorScale.map((majorNote, majorScaleIndex) => {
    const minorNote = minorScale[majorScaleIndex]
    const minorScaleIndex = mod(majorScaleIndex + 3, minorScale.length)

    const majorColorIndex = mod(majorScaleIndex * 7, colors.length)
    const minorColorIndex = mod(minorScaleIndex *7, colors.length)

    const majorColorScales = colors[majorColorIndex].map(x => x.name)
    const minorColorScales = colors[minorColorIndex].map(x => x.name)

    const majorStepClass = majorNote.length === 2 ? 'step half' : 'step'
    const minorStepClass = minorNote.length === 2 ? 'step half' : 'step'

		const majorSynth = majorScaleIndex
		const minorSynth = minorScaleIndex + majorScale.length

    return `
      <div class="group" style="
				transform: rotate(${majorScaleIndex * 30}deg)
				
			">
        <button
          class="${majorStepClass}"
					data-synth="${majorSynth}"
          data-octave="${octave}"
          data-note="${majorNote}"
          style="${printColorScale(majorColorScales)}"
        >
					<div class="label">
						<label>${majorNote}</label>
					</div>
        </button>
        <button
          class="${minorStepClass}"
					data-synth="${minorSynth}"
          data-octave="${octave}"
          data-note="${minorNote}"
          style="${printColorScale(minorColorScales)}"
        >
					<div class="label">
						<label>${minorNote}</label>
					</div>
        </button>
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
    grid-template-rows: 1fr 1fr 1fr;
    clip-path: polygon(20% 0%, 50% 100%, 80% 0%);
    gap: 1px;
  }
  & .step {
    touch-action: manipulation;
    border: none;
    width: 100%;
    height: auto;
    display: grid;
    place-items: start;
    color: black;
		position: relative;
		background: linear-gradient(
			white 2em,
			var(--color-step-4) 2em,
			var(--color-step-3),
			var(--color-step-2)
		)
  }

  & .step.half {
    color: white;
		background: linear-gradient(
			black 2em,
			var(--color-step-4) 2em,
			var(--color-step-3),
			var(--color-step-2)
		)
  }

	& .step::before {
		content: '';
		position: absolute;
		inset: 0;
		background: linear-gradient(
			rgba(0, 0, 0, .85),
			transparent,
			rgba(255, 255, 255, .85),
			transparent,
			transparent,
			transparent
		);
		background-size: 300% 300%;
		background-position-y: 100%;
		animation: &-decay 100ms ease-out forwards;
	}

	& .step.active::before {
		animation: &-attack 100ms ease-out forwards;
	}

	@keyframes &-attack {
		0% {
			background-position-y: 50%;
		}
		100% {
			background-position-y: 0%;
		}
	}

	@keyframes &-decay {
		0% {
			background-position-y: 50%;
		}
		100% {
			background-position-y: 100%;
		}
	}


  & .label {
    display: grid;
    padding: .5em;
    width: 100%;
    pointer-events: none;
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

function printColorScale(scale) {
	return scale.map((name, i) => `--color-step-${i}: var(${name})`).join(';')
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

$.on('mousedown', '.step', attack)
$.on('mouseup', '.step', release)

$.on('touchstart', '.step', attack)
$.on('touchend', '.step', release)

function mod(x, n) {
  return ((x % n) + n) % n;
}

