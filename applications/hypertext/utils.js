
export const emptyEditor = {
  quillDelta: {},
  rawHTML: ""
}

export function editorById($, id) {
  return $.read()[id] || emptyEditor
}
