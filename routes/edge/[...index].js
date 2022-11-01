export const handler = async (request, context) => {
  const pathname = context.params.index

  const edgeHandler = await fetch(`https://1998.social/edge/${pathname}.js`)
    .then((res) => res.json())
    .then(async (data) => {
      if(!data || !data.func) return 'did we edgespect that??'
      const b64moduleData = "data:text/javascript;base64," + btoa(data.func);

      const { handler } = await import(b64moduleData);
      console.log(handler)
      return handler
    })

  console.log(edgeHandler)
  return await edgeHandler(request, context)
}
