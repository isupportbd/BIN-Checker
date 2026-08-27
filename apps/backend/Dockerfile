FROM oven/bun:latest
WORKDIR /app
COPY package.json bun.lockb* ./
RUN bun install
COPY . .
EXPOSE 3001
CMD ["sh", "-c", "bun run drizzle-kit push && bun run src/index.ts"]
