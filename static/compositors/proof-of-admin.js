import { signal } from '/deps.js'
import '/packages/tags/live-code.js';
import '/packages/tags/chalect-bar.js';

export function compositor(target, $, flags) {
  const plugin = target.getAttribute('plugin')

  const { name, render, styles, events } = signal(plugin).file

  return `
    <div>
      <fieldset><legend>No Code Demo</legend>
        plugin: ${name}
        <h2>Render</h2>
        <label for="compositor">Compositor:</label>
        <input type="text" value="${render._link}" /><br/>
        <br/>
        <live-code src="https://1998.social${render._link}"></live-code>
        <hr/>
        <h2>Events</h2>
        <div class="events">
          ${renderEvents(plugin, events.with)}
        </div>
      </fieldset>
    </div>
  `
}

function renderEvents(plugin, list) {
  return list.map((args, i) => {
    const basePath = `file.events.with[${i}]`
    return `
      <chalect-bar
        src="${plugin}#${basePath}.type"
        options="https://1998.social/enums/events"
        label="type"
      ></chalect-bar><br/>
      <label>is</label>
      <input type="text" name="is" data-index="${i}" value="${args.is}" /><br/>
      <label>macro</label>
      <input type="text" name="_link" data-index="${i}" value="${args._link}" /><br/>
      <live-code src="https://1998.social${args._link}"></live-code>
    `
  }).join('')
}
