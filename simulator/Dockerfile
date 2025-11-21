# *************************************** #
# 1. Builder Stage
#   - Install all dependencies (dev + prod)
# *************************************** #
FROM node:20-alpine AS builder

# Set working directory inside container
WORKDIR /app

# Copy package files first for better caching
COPY package*.json ./

# Install full dependency set (dev + prod)
RUN npm ci

# Copy simulator source code
COPY . .


# *************************************** #
# 2. Production Runtime Stage
#   - Only production deps
#   - Smaller + more secure image
# *************************************** #
FROM node:20-alpine AS production

# Set working directory
WORKDIR /app

# Production environment
ENV NODE_ENV=production

# Copy package files again
COPY package*.json ./

# Install ONLY production dependencies
RUN npm ci --omit=dev

# Copy built files or raw source from builder stage
COPY --from=builder /app ./

# Create non-root user for security
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser

# Run the simulator script
CMD ["node", "src/simulator.js"]