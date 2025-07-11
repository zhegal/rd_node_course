# builder
FROM node:20-alpine AS builder
WORKDIR /app
COPY ./package*.json ./
COPY ./tsconfig*.json ./
COPY ./rewrite-imports.js ./
RUN npm ci
COPY ./src ./src
RUN npm run build

# runtime
FROM alpine:3.20
RUN apk add --no-cache nodejs tini
RUN adduser -D -h /home/node node
WORKDIR /home/node
USER node
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/rewrite-imports.js ./
COPY --from=builder /app/dist ./dist
ENTRYPOINT ["/sbin/tini", "--"]
CMD ["node", "./dist/main.js"]
EXPOSE 3000