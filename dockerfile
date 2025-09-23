# Build stage
FROM node:20-bullseye-slim AS build
WORKDIR /app

# Environment
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Install dependencies
COPY package*.json ./
RUN npm ci --no-audit --no-fund

# Copy source
COPY . .

# Build the app (includes Prisma generate via package.json script)
RUN npm run build

# Runtime stage
FROM node:20-bullseye-slim
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000
ENV NEXT_TELEMETRY_DISABLED=1

# Install required system deps for Prisma/OpenSSL
RUN apt-get update \
  && apt-get install -y --no-install-recommends openssl ca-certificates \
  && rm -rf /var/lib/apt/lists/*

# Copy built app
COPY --from=build /app ./

EXPOSE 3000

# Run Next.js standalone server as recommended for output: standalone
CMD ["node", ".next/standalone/server.js"]
