import $, { tooltip } from './tooltip.js';
import { on } from 'https://deno.land/x/tag@v0.3.2/mod.js';

$.on('click', `:not(ctx-tooltip)`, hide);

export function popover(event, content) {
  tooltip(event, content);
}

function hide(event) {
  if(event.target.closest('ctx-tooltip')) return
  tooltip();
}