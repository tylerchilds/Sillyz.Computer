import { EventType, WindowBuilder, Font } from "https://deno.land/x/sdl2/mod.ts";
import tag from "../../tag/mod.js"

const $ = tag('video-game')

const window = new WindowBuilder("Hello, Deno!", 640, 480).build();
const canvas = window.canvas();
const noop = () => null;
const log = (...args) => console.log(args)

const handlers = {
  [EventType.First]: log,
	[EventType.Quit]: () => true,
  [EventType.AppTerminating]: log,
  [EventType.AppLowMemory]: log,
  [EventType.AppWillEnterBackground]: log,
  [EventType.AppDidEnterBackground]: log,
  [EventType.AppWillEnterForeground]: log,
  [EventType.AppDidEnterForeground]: log,
  [EventType.WindowEvent]: log,
  [EventType.KeyDown]: log,
  [EventType.KeyUp]: log,
  [EventType.MouseMotion]: log,
  [EventType.MouseButtonDown]: mouseButtonDown,
  [EventType.MouseButtonUp]: mouseButtonUp,
  [EventType.MouseWheel]: log,
  [EventType.AudioDeviceAdded]: log,
  [EventType.AudioDeviceRemoved]: log,
  [EventType.User]: log,
  [EventType.Last]: log,
  [EventType.Draw]: draw,
}

for (const event of window.events()) {
	if((handlers[event.type] || noop)(event) === true) {
		break
	}
}

function mouseButtonDown() {
  $.write({ pressed: true })
}

function mouseButtonUp() {
  $.write({ pressed: false })
}

function draw() {
  const { pressed } = $.read()
  const mod = pressed ? 128 : -128
  // Rainbow effect
  const r = Math.sin(Date.now() / 1000) * 127 + mod;
  const g = Math.sin(Date.now() / 1000 + 2) * 127 + mod;
  const b = Math.sin(Date.now() / 1000 + 4) * 127 + mod;
  canvas.setDrawColor(Math.floor(r), Math.floor(g), Math.floor(b), 255);
  canvas.clear();
  canvas.present();
}
