# Build stage
FROM node:20-bullseye-slim AS build
WORKDIR /app

# Environment
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Copy source and install dependencies
COPY . .

# Install all dependencies (including dev for build)
RUN npm install --no-audit --no-fund

# Build the app (includes Prisma generate via package.json script)
RUN npm run build

# Clean up unnecessary files to save space
RUN rm -rf node_modules/.cache
RUN rm -rf .next/cache

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

# Copy only necessary files from build
COPY --from=build /app/.next ./.next
COPY --from=build /app/public ./public
COPY --from=build /app/package.json ./package.json
COPY --from=build /app/package-lock.json ./package-lock.json
COPY --from=build /app/node_modules/.prisma ./node_modules/.prisma

EXPOSE 3000

# Run Next.js standalone server as recommended for output: standalone
CMD ["node", ".next/standalone/server.js"]
