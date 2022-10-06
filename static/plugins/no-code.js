export function plugin() {
  return {
    "name": "no-code",
    "render": {
      "_link": "http://localhost:1998/files/compositors/hello.js"
    },
    "styles": {
      "with": [{
        "_link": "http://localhost:1998/files/styles/hello.json"
      }]
    },
    "events": {
      "with": [{
        "type": "click",
        "is": "button",
        "_link": "http://localhost:1998/files/macros/hello.js"
      }]
    }
  }
}
