FROM node:20-alpine AS builder

WORKDIR /app

# Increase Node memory limit for build
ENV NODE_OPTIONS="--max-old-space-size=4096"

# Copy package files and install dependencies (leveraging Docker layer caching)
COPY package.json package-lock.json ./
COPY .npmrc ./
RUN echo "Installing dependencies..." && \
    npm ci --prefer-offline --no-audit --legacy-peer-deps

# Copy application code
COPY . .

# Debug the environment before building
RUN echo "===== DEBUG INFO =====" && \
    echo "Node version: $(node -v)" && \
    echo "NPM version: $(npm -v)" && \
    echo "Directory structure:" && \
    ls -la && \
    echo "Environment variables:" && \
    env | grep NEXT || true && \
    echo "package.json content:" && \
    cat package.json

# Build the application with CSS purging for reduced size
RUN echo "Starting Next.js build with CSS purging..." && \
    npm run build:purge || (echo "Build failed with error code $?" && ls -la && exit 1) && \
    echo "CSS purging complete - CSS files optimized and reduced in size"

# Production image
FROM node:20-alpine AS runner

WORKDIR /app

# Set timezone to Africa/Nairobi
ENV TZ=Africa/Nairobi
RUN apk add --no-cache tzdata && \
    cp /usr/share/zoneinfo/Africa/Nairobi /etc/localtime && \
    echo "Africa/Nairobi" > /etc/timezone && \
    apk del tzdata

# Create a non-root user
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Copy necessary files from builder
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
# Copy scripts folder for cron jobs
COPY --from=builder /app/scripts ./scripts

# Create logs directory for CSP violation reports
RUN mkdir -p logs && chown -R nextjs:nodejs logs

# Set correct permissions
RUN chown -R nextjs:nodejs /app

# Install production-only dependencies for better performance
RUN npm install sharp --no-save --legacy-peer-deps

# Add compression and cache optimization tools
RUN apk add --no-cache gzip brotli

# Install curl during image build
RUN apk update && apk add --no-cache curl
# Compress static assets for faster serving
RUN find ./.next/static -type f -not -name "*.gz" -not -name "*.br" | xargs -P 0 -I {} sh -c 'gzip -9 -k "{}" && brotli -Z "{}"'

# Switch to non-root user
USER nextjs

# Expose port and start application
EXPOSE 3000
CMD ["node", "server.js"]