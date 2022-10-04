export const handler = async () => {
  const file = await Deno.readFile(`${Deno.cwd()}/static/pages/index.html`)
  return new Response(file)
}
