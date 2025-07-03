# builder
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY src ./src
COPY build.mjs ./build.mjs
RUN node build.mjs

# prod-deps build
FROM node:18-alpine AS prod-deps
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev

# runtime
FROM alpine:3.20
RUN apk add --no-cache nodejs tini
RUN adduser -D -h /home/node node
WORKDIR /home/node
USER node
COPY --from=prod-deps /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/dist ./dist
ENV NODE_ENV=prod
ENTRYPOINT ["/sbin/tini", "--"]
CMD ["node", "./dist/server.mjs"]
EXPOSE 3000