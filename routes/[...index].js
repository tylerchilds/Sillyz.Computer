import { typeByExtension, extname } from "$fresh/src/server/deps.ts";
import { Status } from "$fresh/server.ts";

export const handler = async (_request, context) => {
  const pathname = context.params.index

  console.log(pathname)
  const cascade = [
    Deno.readFile(`${Deno.cwd()}/static/${pathname}`),
    Deno.readFile(`${Deno.cwd()}/static/${pathname}/index.html`),
    fetch(`https://1998.social/${pathname}`)
      .then((res) => res.json())
      .then((data) => {
        console.log(data)
        if(!data || !data.file) return 'did we expect that'
        if(extname(pathname) === '.json') return JSON.stringify(data.file);
        return data.file;
      })
  ]

  for (const promise of cascade) {
    try {
      const file = await promise
      console.log(file)
      return new Response(file, {
        headers: {
          "Content-Type": typeByExtension(extname(pathname)) || 'text/html; charset=utf-8'
        }
      });
    } catch(_e) {
      continue
    }
  }

  return new Response(
    await Deno.readFile(`${Deno.cwd()}/static/applications/hypertext/index.html`),
    { status: Status.NotFound }
  )
}
