export const handler = async (request, context) => {
  const pathname = context.params.index
      console.log(pathname)

  const { handler } = await fetch(`https://1998.social/edge/${pathname}.js`)
    .then((res) => res.json())
    .then((data) => {
      console.log(data)
      if(!data || !data.func) return 'did we edgespect that??'
      const b64moduleData = "data:text/javascript;base64," + btoa(data.func);

      return import(b64moduleData);
    })

  return await handler(request, context)
}
