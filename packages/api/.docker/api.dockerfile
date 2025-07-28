FROM node:24-alpine AS builder

WORKDIR /usr/src/app
COPY package.json yarn.lock ./
RUN yarn install --fronzen-lockfile
COPY . .
RUN npx nest build api

FROM node:24-alpine

WORKDIR /usr/src/app

COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/package.json ./package.json
COPY --from=builder /usr/src/app/yarn.lock ./yarn.lock

RUN yarn install --frozen-lockfile

EXPOSE 3001

# Define the command to run the application
CMD ["node", "dist/cron-entry.js"]
