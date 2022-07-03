import { EventType, WindowBuilder } from "https://deno.land/x/sdl2/mod.ts";

const window = new WindowBuilder("Hello, Deno!", 640, 480).build();
const canvas = window.canvas();

for (const event of window.events()) {
  if (event.type == EventType.Quit) {
    break;
  } else if (event.type == EventType.Draw) {
    // Rainbow effect
    const r = Math.sin(Date.now() / 1000) * 127 + 128;
    const g = Math.sin(Date.now() / 1000 + 2) * 127 + 128;
    const b = Math.sin(Date.now() / 1000 + 4) * 127 + 128;
    canvas.setDrawColor(Math.floor(r), Math.floor(g), Math.floor(b), 255);
    canvas.clear();
    canvas.present();
  }
}
