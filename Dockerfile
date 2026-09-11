# syntax=docker/dockerfile:1
# Multi-stage Dockerfile for The Byte Array website
# Stage 1: Dependencies
FROM node:20-alpine AS deps

WORKDIR /app

COPY package.json package-lock.json* ./

RUN npm ci --ignore-scripts

# Stage 2: Builder
FROM node:20-alpine AS builder

WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

RUN npm run build

# Stage 3: Runtime (production nginx)
FROM nginx:1.27-alpine AS runtime

LABEL org.opencontainers.image.title="thebytearray.org"
LABEL org.opencontainers.image.description="The Byte Array official website"
LABEL org.opencontainers.image.source="https://github.com/thebytearray/website"
LABEL org.opencontainers.image.licenses="GPL-3.0"

# Install ca-certificates for HTTPS healthchecks
RUN apk add --no-cache ca-certificates curl

# Copy custom nginx configuration
COPY nginx/container/default.conf /etc/nginx/conf.d/default.conf
COPY nginx/container/security.conf /etc/nginx/conf.d/security.conf

# Copy built assets from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Healthcheck
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD wget -qO- http://127.0.0.1/health.html > /dev/null || exit 1

EXPOSE 80 443

ENTRYPOINT ["nginx", "-g", "daemon off;"]
