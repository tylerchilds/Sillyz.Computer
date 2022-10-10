const events = [
  'click',
  'dblclick',
  'contextmenu',
  'submit'
]

export const handler = () => {
  return new Response(JSON.stringify(
    events.map(x => ({ id: x, value: x }))
  ));
};
