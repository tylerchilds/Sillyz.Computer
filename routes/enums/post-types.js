const postTypes = [
  {
    id: 'text',
    value: 'Text'
  },
  {
    id: 'picture',
    value: 'Picture'
  },
  {
    id: 'video',
    value: 'Video'
  },
  {
    id: 'audio',
    value: 'Audio'
  },
  {
    id: 'canvas',
    value: 'Canvas'
  },
  {
    id: 'sequence',
    value: 'Sequence'
  },
  {
    id: 'plugin',
    value: 'Plugin'
  },
  {
    id: 'page',
    value: 'Page'
  },
  {
    id: 'app',
    value: 'App'
  },
]

export const handler = () => {
  return new Response(JSON.stringify(postTypes));
};
