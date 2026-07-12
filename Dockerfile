# ============================================================
# MetroCoop — Dockerfile for Railway
# ============================================================
FROM node:20-alpine

WORKDIR /app

# Install build tools for native modules (pg is pure JS, but just in case)
RUN apk add --no-cache curl bash

# Copy root package files
COPY package.json package-lock.json* ./
COPY apps/web/package.json ./apps/web/
COPY packages/shared/package.json ./packages/shared/

# Install all dependencies (including dev for build)
RUN npm install

# Copy source code
COPY . .

# Build everything (web app + server)
RUN npm run build:railway

# Expose port (Railway injects PORT)
EXPOSE 3000

# Start: migrate + seed + serve
CMD ["./start.sh"]
