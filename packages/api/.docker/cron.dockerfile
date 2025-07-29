FROM node:24-alpine AS builder

WORKDIR /usr/src/app
COPY  yarn.lock .yarnrc.yml package.json ./
COPY packages/api/ ./packages/api/
COPY .yarn .yarn
RUN yarn workspaces focus api

RUN yarn workspace api docker:api:build

FROM node:24-alpine

WORKDIR /usr/src/app
COPY --from=builder /usr/src/app/packages/api/dist ./packages/api/dist
COPY --from=builder /usr/src/app/packages/api/package.json ./packages/api/package.json
COPY --from=builder /usr/src/app/package.json ./package.json
COPY --from=builder /usr/src/app/.yarnrc.yml ./.yarnrc.yml
COPY --from=builder /usr/src/app/yarn.lock ./yarn.lock
COPY --from=builder /usr/src/app/.yarn ./.yarn

RUN yarn workspaces focus --production api

CMD ["node", "packages/api/dist/cron-entry.js"]
