const isNative = Deno.env.get("NATIVE")

async function nativeClient() {
  const { Webview } = await import("https://deno.land/x/webview/mod.ts")
  const webview = new Webview()

  webview.navigate("http://127.0.0.1:8000")
  webview.run()
}

async function browserClient() {
  const { open } = await import("https://deno.land/x/opener/mod.ts")
  await open('http://127.0.0.1:8000')
}

console.log({ isNative })
isNative ? nativeClient() : browserClient()
