// DO NOT EDIT. This file is generated by fresh.
// This file SHOULD be checked into source version control.
// This file is automatically updated during development when running `dev.ts`.

import config from "./deno.json" assert { type: "json" };
import * as $0 from "./routes/[...index].js";
import * as $1 from "./routes/edge/[...index].js";
import * as $2 from "./routes/enums/events.js";
import * as $3 from "./routes/enums/post-types.js";
import * as $4 from "./routes/index.js";

const manifest = {
  routes: {
    "./routes/[...index].js": $0,
    "./routes/edge/[...index].js": $1,
    "./routes/enums/events.js": $2,
    "./routes/enums/post-types.js": $3,
    "./routes/index.js": $4,
  },
  islands: {},
  baseUrl: import.meta.url,
  config,
};

export default manifest;
