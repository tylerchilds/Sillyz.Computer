import * as Tone from 'https://esm.sh/tone@next'
import tag from 'https://deno.land/x/tag@v0.3.2/mod.js';
import gamepads from "./gamepad.js"

const initialState = {
  activeChords: [],
  activeNotes: [],
  activeOctaves: [],
  activeStrums: [],
  frames: {},
}

const $ = tag('.z-instrument', initialState)
const baseOctave = 3
const fretMap = [0, 1, 3, 2, 4]
const notes = ["c", "d", "e", "f", "g", "a", "b"]

const chords = [
  "x    ", // a ( c - 2 )

  " x   ",
  "  x  ", // c
  "   x ",
  "    x",

  "xx   ",
  "x x  ", // g
  "x  x ",
  "x   x",

  "xxx  ", // c
  "xx x ",
  "xx  x",
  "xxxx ",

  "xxx x", // g
  "xxxxx",
  " xx  ",
  " x x ", // c

  " x  x",
  " xxx ",
  " xx x",
  " xxxx", // g

  "  xx ",
  "  x x",
  "  xxx", // c
  "   xx",
]

const colors = {
  "x    ": 'green',
  " x   ": 'red',
  "  x  ": 'yellow',
  "   x ": 'blue',
  "    x": 'orange',

  "xx   ": 'yellow',
  "x x  ": 'orange',
  "x  x ": 'chartruese',
  "x   x": 'teal',

  "xxx  ": 'amber',
  "xx x ": 'indigo',
  "xx  x": 'chartruese',
  "xxxx ": 'magenta',

  "xxx x": 'amber',
  "xxxxx": 'green',
  " xx  ": 'orange',
  " x x ": 'violet',

  " x  x": 'flame',
  " xxx ": 'fuschia',
  " xx x": 'orange',
  " xxxx": 'chartruese',

  "  xx ": 'green',
  "  x x": 'amber',
  "  xxx": 'amber',
  "   xx": 'fuschia'
}

const shades = {
  [1]: [6, 2],
  [-1]: [1, 5],
}

function ready() {
  return new Promise((ready) => {
    (function loop() {
      gamepads() ? ready() : requestAnimationFrame(loop)
    })()
  })
}

let synths
let once = () => { once = () => null
  synths = [
    new Tone.Synth().toDestination()
  ]
}

(async function loop(time) {
  await ready()
  once()

  const activeFrets = gamepads().map(x => toFrets($, x))
  const activeChords = activeFrets.map(x => toChords($, x))
  const activeNotes = activeChords.map(getNote)
  const activeOctaves = activeChords.map(getOctave)
  const activeStrums = gamepads().map(x => toStrums($, x))
  const activeMotion = gamepads().map(x => toMotion($, x))

  const activeColors = activeFrets.map(getColor)
  const activeShades = activeStrums.map(getShades)
  const activeThemes = activeColors.map((x, i) => toTheme($, {
    color: x,
    shades: activeShades[i]
  }))

  $.write({
    time,
    activeFrets,
    activeChords,
    activeNotes,
    activeOctaves,
    activeStrums,
    activeMotion,
    activeColors,
    activeShades,
    activeThemes
  })

  activeStrums.map((strum, i) => {
    if(isActuated(strum)) {
      const snapshot = () => playNote($, {
        index: i,
        note: activeNotes[i],
        octave: activeOctaves[i],
        theme: activeThemes[i]
      })
      throttle($, {
        key: `strum-${i}`,
        activate: snapshot,
        time,
        fps: 1000 / 4
      })
    }
  })


  activeMotion.map(({ horizontal }, i) => {
    if(isActuated(horizontal)) {
      const cheat = {[-1]: 37, [1]: 39}[horizontal]
			const activate = () => {
				document.dispatchEvent(new KeyboardEvent("keydown", {
					view: window,
					keyCode: cheat,
					bubbles: true,
					cancelable: true
				}))
			}
      console.log(activate, cheat)

			throttle($, {
				key: 'slide',
				activate,
				time: Date.now(),
				fps: 1000 / 4
			})
    }
  })


  requestAnimationFrame(loop)
})()

$.render(() => {
  const {
    activeChords,
    activeNotes,
    activeStrums,
    activeThemes
  } = $.read()

  const classes = (i) => `note ${activeStrums[i] ? 'strummed' : ''}`
  const styles = (i) => {
    const { foreground, background } = activeThemes[i]
    return `
      background: ${background};
      foreground: ${foreground};
    `
  }

  return activeChords.map((_chord, i) => `
    <div class="${classes(i)}" style="${styles(i)}">
      ${activeNotes[i]}
    </div>
  `).join('')
})

function toFrets(_$, flags) {
  const pressed = value => value === 1 ? "x" : " "
  const frets = flags.buttons.map(pressed).slice(0, 5)
  return fretMap.map(i => frets[i]).join('')
}

function toChords(_$, frets) {
  return chords.indexOf(frets) - 2
}

function toStrums(_$, flags) {
  const [strumbar] = [...flags.axes].splice(-1)
  return strumbar
}

function toMotion(_$, flags) {
  const [vertical] = [...flags.axes].splice(-1)
  const [horizontal] = [...flags.axes].splice(-2)
  return {horizontal, vertical}
}


function getNote(chord) {
  return notes[mod(chord, notes.length)]
}

function getOctave(chord) {
  const rawOctave = Math.floor(divide(chord, notes.length))
  return rawOctave + baseOctave
}

function getColor(frets) {
  return colors[frets] || 'silver'
}

function getShades(strum) {
  return shades[strum] || [1, 7]
}

function toTheme(_$, flags) {
  const { color, shades } = flags
  const [x, y] = shades
  return {
    background: `var(--${color}${x})`,
    foreground: `var(--${color}${y})`
  }
}

function divide(x, n) {
  return Math.floor((x + n) / n) - 1;
}

function mod(x, n) {
  return ((x % n) + n) % n;
}

function isActuated(value) {
  return [-1, 1].includes(value)
}

function throttle($, flags) {
  const { frames = {}} = $.read()
  const frame = frames[flags.key] || {}

  if((flags.time - flags.fps) > (frame.time || 0)) {
    flags.activate()
    $.write({ time: flags.time }, (state, payload) => {
      return {
        ...state,
        frames: {
          ...frames,
          [flags.key]: {
            time: payload.time
          }
        }
      }
    })
  }
}

function playNote(_$, flags) {
  const { note, octave, theme, index } = flags
  const now = Tone.now()
  synths[index].triggerAttackRelease(`${note}${octave}`, "8n", now);

  const html = document.querySelector('html')
  html.style = `
    --bg: ${theme.background};
    --fg: ${theme.foreground};
  `
}

$.style(`
  & {
    display: grid;
    grid-template-columns: 1fr 1fr;
    height: 100vh;
    width: 100vw;
    place-items: center;
  }
  & .note {
    font-size: 10vh;
  }

  & .strummed {
    transform: scale(2);
  }
`)

export default $
