# Multi-stage build for MarketMind

# Stage 1: Build
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY turbo.json ./
COPY apps/api/package*.json ./apps/api/
COPY apps/web/package*.json ./apps/web/
COPY packages/*/package*.json ./packages/

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Generate Prisma client
RUN cd apps/api && npx prisma generate

# Build applications
RUN npm run build

# Stage 2: API Production
FROM node:18-alpine AS api

WORKDIR /app

# Copy built API
COPY --from=builder /app/apps/api/dist ./dist
COPY --from=builder /app/apps/api/node_modules ./node_modules
COPY --from=builder /app/apps/api/package*.json ./
COPY --from=builder /app/apps/api/prisma ./prisma

# Expose port
EXPOSE 3001

# Start API
CMD ["npm", "start"]

# Stage 3: Web Production
FROM node:18-alpine AS web

WORKDIR /app

# Copy built web app
COPY --from=builder /app/apps/web/.next ./.next
COPY --from=builder /app/apps/web/node_modules ./node_modules
COPY --from=builder /app/apps/web/package*.json ./
COPY --from=builder /app/apps/web/public ./public

# Expose port
EXPOSE 3000

# Start web app
CMD ["npm", "start"]
