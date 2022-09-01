new Worker(
  new URL("./server.js", import.meta.url).href,
  {
    type: "module",
    deno: {
      namespace: true,
    },
  },
);

new Worker(
  new URL("./client.js", import.meta.url).href,
  {
    type: "module",
    deno: {
      namespace: true,
    },
  },
);
