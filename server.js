import { serve } from "https://deno.land/std@0.114.0/http/server.ts";
import { Status } from "https://deno.land/std@0.114.0/http/http_status.ts";
import { ensureFileSync } from "https://deno.land/std@0.114.0/fs/mod.ts";

const methods = {
  'GET': handleGet,
  'POST': handlePost,
}

const modes = {
  'save': save,
}

async function save(pathname, params) {
  const { value } = params
  ensureFileSync(`.${pathname}`)
  await Deno.writeTextFile(`.${pathname}`, value).catch(console.error)
  return html(value)
}

async function handleRequest(request) {
  console.log('\n\n\n\nWHAT'+ request.method +'\n\n\n\n')
  return await (methods[request.method] || methods['GET'])(request)
}

async function handlePost(request) {
  const { pathname } = new URL(request.url);
  const params = await request.json()

  return (modes[params.mode] || function(){})(pathname, params)
}

async function handleGet(request) {
  const { pathname } = new URL(request.url);

  console.log("get", pathname);

  if (pathname === '/') {
    const file = await Deno.readFile(`${Deno.cwd()}/pages/index.html`)
    return html(file)
  }

  let file = ''

  try {
    file = await Deno.readFile(`.${pathname}`)
  } catch(e) {
    console.log(e)
    return await blank(request)
  }

  const extension = pathname.split('.').slice(-1)

  return new Response(file, {
    headers: {
      'content-type': getType(extension),
    },
  })
}

async function blank(request) {
  const { pathname } = new URL(request.url);
  console.log(pathname)

  try {
    return html(
      await Deno.readFile(`.${pathname}/index.html`)
    )
  } catch(e) {
    console.error(e)
    return html(
      await Deno.readFile(`${Deno.cwd()}/applications/hypertext/index.html`),
      { status: Status.NotFound }
    )
  }
}

function html(content, options = {}) {
  return new Response(content, {
    headers: {
      'content-type': getType('html'),
    },
    ...options
  })
}

const types = {
  'css': 'text/css; charset=utf-8',
  'html': 'text/html; charset=utf-8',
  'js': 'text/javascript; charset=utf-8'
}

function getType(ext) {
  return types[ext] || types['html']
}

console.log("Listening on http://localhost:1998");
serve(handleRequest, { addr: ':1998' });
