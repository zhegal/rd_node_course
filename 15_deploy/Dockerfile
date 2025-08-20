FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
COPY tsconfig*.json ./
RUN npm i
COPY src src
RUN npm run build

FROM node:20-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm i --omit=dev

FROM alpine:3.20
ENV NODE_ENV=production
RUN apk add --no-cache nodejs tini
RUN adduser -D -h /home/node node
WORKDIR /home/node
COPY --from=deps --chown=node:node /app/node_modules node_modules
COPY --from=builder --chown=node:node /app/package*.json ./
COPY --from=builder --chown=node:node /app/dist dist
USER node
ENTRYPOINT ["/sbin/tini","--"]
CMD ["node","dist/main.js"]
EXPOSE 3000