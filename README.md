# nodejs-boilerplate

## Commands

### Run the local development server

`bun run dev`

### Build the application

`bun run build`

### Start a built (transpiled) version locally

`bun run start`

## Development setup

1. Make sure to have correct Node.js version
2. Install `bun` package manager for installing dependencies.
3. Add and `.env.local` file to you project root directory. See `Environment variables` sections for values to add.
4. Then run `bun run dev` to start a local server.

## Environment variables

```
NODE_ENV="development"
PORT=8000
```

## Running a local Docker container

Run `docker build -t nodejs-boilerplate .` to start a local docker container of the application.
And then `docker run  nodejs-boilerplate -p 8000:8000` 
