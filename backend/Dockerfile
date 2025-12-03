# *************************************** #
# 1. Builder Stage
#   - Install dependencies
# *************************************** #

FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Copy only package files first (better Docker caching)
COPY package*.json ./

# Install ALL dependencies (dev + prod) for build step
RUN npm ci

# Copy rest of the source code
COPY . .

# *************************************** #
# 2. Production Runtime Stage
#   - Minimal, secure
#   - Only production deps
#   - Non-root user
# *************************************** #
FROM node:20-alpine AS production

WORKDIR /app

# Set environment for runtime
ENV NODE_ENV=production

# Install curl for healthchecks (Alpine doesn't include it by default)
RUN apk add --no-cache curl

# Copy only package files again
COPY package*.json ./

# Install ONLY production dependencies
RUN npm ci --omit=dev

# Copy application source from builder (only src, not node_modules)
COPY --from=builder /app/src ./src

# Create non-root user with fixed UID/GID for consistency across environments
# -S: system user (no password, no shell)
# -u/-g 10001: fixed IDs prevent permission issues with volumes/k8s
RUN addgroup -S -g 10001 appgroup && \
    adduser -S -u 10001 -G appgroup -h /app appuser && \
    chown -R appuser:appgroup /app

# Switch to non-root user (principle of least privilege)
USER appuser

# Expose app port
EXPOSE 4000

# Health check for Kubernetes, Docker Swarm, Docker Compose
HEALTHCHECK --interval=20s --timeout=3s --start-period=10s --retries=3 \
    CMD node -e "require('http').get('http://localhost:4000/devices', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})" || exit 1

# Start service using npm start
CMD ["npm", "start"]