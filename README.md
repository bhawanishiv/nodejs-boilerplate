# nodejs-boilerplate

## Commands

### Run the local development server

`pnpm dev`

### Build the application

`pnpm build`

### Start a built (transpiled) version locally

`pnpm start`

## Development setup

1. Make sure to have correct Node.js version
2. Install `pnpm` package manager for installing dependencies.
3. Add and `.env` file to you project root directory. See `Environment variables` sections for values to add.
4. Then run `yan dev` to start a local server.

## Environment variables

```
NODE_ENV="development"
PORT=5000
```

## Running a local Docker container

Run `docker compose up  -f compose-dev.yml -d` to start a local docker container of the application.

> Note: Use `compose.yml` file if you want to run a docker container with production configuration.
