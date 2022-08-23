import { serve } from "https://deno.land/std@0.114.0/http/server.ts";

async function handleRequest(request) {
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
      await Deno.readFile(`${Deno.cwd()}/errors/404/index.html`)
    )
  } catch(e) {
    console.error(e)
  }
}

function html(content) {
  return new Response(content, {
    headers: {
      'content-type': getType('html'),
    },
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

console.log("Listening on http://localhost:8000");
serve(handleRequest);
