import { Webview } from "./deps/webview/mod.ts";

const webview = new Webview();

webview.navigate("http://127.0.0.1:8000/safe/hello-world.html");
webview.run();
