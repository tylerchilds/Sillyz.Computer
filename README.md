# Sillyz.Computer

### Development from source

1. Install deno from https://deno.land
2. Start the project:

```
deno run -A --unstable --watch=errors/,pages,/packages/,static/ server.js
```

### Updating dependencies

Gotta Cache'm All!

```
deno cache --lock=lock.json --lock-write client.js server.js
```

3. Visit http://localhost:8000

This will watch the project directory and restart as necessary.

### Compiling from source

```
deno compile -A --unstable --output=Sillyz.Computer server.js
```
