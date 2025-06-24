FROM alpine:latest
RUN apk add --no-cache nodejs npm && \
    adduser -D -h /home/node node && \
    mkdir /app && chown node /app
USER node
WORKDIR /app