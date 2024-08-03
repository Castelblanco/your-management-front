FROM node:20 AS builder
RUN npm install -g bun
# Install Bun.js
WORKDIR /app
COPY . .

RUN bun install
RUN bun run build

FROM oven/bun:1.1.20-alpine

COPY --from=builder /app/build .
EXPOSE 3000
CMD [ "bun", "run", "start" ]