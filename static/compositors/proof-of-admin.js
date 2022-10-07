import { signal } from '/deps.js'
import '/packages/tags/live-code.js';

export function compositor(target, $, flags) {
  const plugin = target.getAttribute('plugin')

  const { name, render, styles, events } = signal(plugin).file

  return `
    <form>
      <fieldset><legend>No Code Demo</legend>
        plugin: ${name}
        <h2>Render</h2>
        <label for="compositor">Compositor:</label>
        <input type="text" value="${render._link}" /><br/>
        <br/>
        <live-code src="https://1998.social${render._link}"></live-code>
        <hr/>
        <h2>Events</h2>
        ${renderEvents(events.with)}
      </fieldset>
    </form>
  `
}

function renderEvents(list) {
  return list.map((args, i) => {
    return `
      <label>type</label>
      <input type="text" value="${args.type}" /><br/>
      <label>is</label>
      <input type="text" value="${args.is}" /><br/>
      <label>macro</label>
      <input type="text" value="${args._link}" /><br/>
      <live-code src="https://1998.social${args._link}"></live-code>
    `
  }).join('')
}
