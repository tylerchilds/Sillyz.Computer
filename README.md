# Sillyz.Computer

### Development from source

1. Install deno from https://deno.land
2. Start the project:

```
deno task start
```
Note: This will watch the project directories and restart as necessary.

3. Visit http://localhost:1998

### Updating dependencies

Gotta Cache'm All!

```
deno cache --lock=lock.json --lock-write client.js server.js
```

### Compiling from source

```
deno compile -A --unstable --output=Sillyz.Computer server.js
```

This will result in a single binary that can be used across the same architecture it was compiled on.
