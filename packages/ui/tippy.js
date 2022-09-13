/*
 * Tippy: Like if Clippy was a Tooltip
 */
import tag from 'https://deno.land/x/tag@v0.2.0/mod.js';

const $ = tag('body')

$.on('mouseenter', '[data-tippy]', (event) => {
  tippy(event, event.target.dataset.tippy);
});

$.on('mousemove', '[data-tippy]', (event) => {
  tippy(event);
});

$.on('mouseleave', '[data-tippy]', (event) => {
  tippy();
});

// initialize tippy
const node = document.createElement('ctx-tippy');
document.body.appendChild(node);

export default function tippy(event, content) {
  switch(arguments.length) {
    case 2:
      show(event, content);
      break;
    case 1:
      move(event);
      break;
    default:
      hide();
  }
}

function show(event, content) {
  node.classList.add('active');
  node.innerHTML = content;
  move(event);
}

function move(event) {
  const { x, y } = event;
  node.dataset.x = x;
  node.dataset.y = y;

  animate();
}

function hide() {
  node.classList.remove('active');
}

function animate() {
  requestAnimationFrame(draw)
}

function draw() {
  const { x, y } = node.dataset;

  node.style.setProperty("--x", x + 'px');
  node.style.setProperty("--y", y + 'px');
}

const tippyStyles = `
  <style>
    ctx-tippy {
      background: white;
      color: rgba(0, 0, 0, .9);
      border-radius: 2px;
      box-shadow:
        0 1px 2px 0 rgba(0, 0 , 0, .1),
        0 2px 4px 0 rgba(0, 0 , 0, .1);
      display: none;
      font-size: 13px;
      left: 0;
      line-height: 1.25;
      padding: 8px;
      position: fixed;
      opacity: 0;
      transform-origin: right bottom;
      transform: translate(
        max(0px, calc(-100% + var(--x) - 3px)),
        max(0px, calc(-100% + var(--y) - 3px))
      );
      transition: opacity 100ms ease-in-out;
      top: 0;
      white-space: break-work;
      max-width: 200px;
      pointer-events: none;
      z-index: -1;
    }

    ctx-tippy * {
      pointer-events: auto;
    }

    ctx-tippy.active {
      display: block;
      opacity: 1;
      z-index: 3;
    }
  </style>
`;

document.body.insertAdjacentHTML("beforeend", tippyStyles);
