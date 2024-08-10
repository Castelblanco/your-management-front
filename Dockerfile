FROM node:20.10 AS builder
RUN npm i -g bun

WORKDIR /app
COPY . .
RUN bun i
RUN bun run build

FROM oven/bun:1.1.20-alpine

COPY --from=builder /app/build .
EXPOSE 3000
CMD [ "bun", "run", "start" ]