FROM node:18-alpine AS base


FROM base as builder

# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat

COPY . /app
WORKDIR /app
RUN yarn install --frozen-lockfile
RUN yarn build



FROM base AS runner
WORKDIR /app
ARG PORT=5000
ENV NODE_ENV=production

COPY --from=builder /app/dist /app/dist
COPY package.json yarn.lock /app/
RUN yarn install --production

# to add bash in the container
RUN apk update
RUN apk upgrade
RUN apk add bash

EXPOSE ${PORT}

CMD ["node","dist/index.js"]