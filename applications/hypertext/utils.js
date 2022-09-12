export const shape = {
  quillDelta: {},
  rawHTML: ""
}

export function shapeById($, id) {
  return $.read()[id] || shape
}
