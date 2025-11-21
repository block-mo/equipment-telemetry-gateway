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

# Copy only package files again
COPY package*.json ./

# Install ONLY production dependencies
RUN npm ci --omit=dev

# Copy built app or raw source if no build step
COPY --from=builder /app ./

# Create a non-root user for security
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Switch to non-root user
USER appuser

# Expose app port
EXPOSE 4000

# Start service
CMD ["node", "src/index.js"]