# EasyPanel Configuration Templates

This file contains all the configuration templates needed for deploying your CRM application to EasyPanel.

## Environment Variables Template

Copy these variables to your EasyPanel environment configuration:

```bash
# Application URL (replace with your actual EasyPanel URL)
NEXTAUTH_URL=https://your-app.easypanel.io
NEXT_PUBLIC_APP_URL=https://your-app.easypanel.io

# Database Configuration - Option 1: EasyPanel Managed Services
DATABASE_URL=postgresql://username:password@host:port/database_name
REDIS_URL=redis://username:password@host:port

# Database Configuration - Option 2: Docker Containers
DATABASE_URL=postgresql://postgres:${POSTGRES_PASSWORD}@postgres:5432/restaurant_crm
REDIS_URL=redis://redis:6379
POSTGRES_PASSWORD=your-secure-postgres-password
REDIS_PASSWORD=your-secure-redis-password

# Security Secrets (generate new secure values for production)
JWT_SECRET=your-super-secure-jwt-secret-key-here-min-32-chars
REFRESH_TOKEN_SECRET=your-super-secure-refresh-token-secret-here-min-32-chars
NEXTAUTH_SECRET=your-super-secure-nextauth-secret-here-min-32-chars

# Email Configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
EMAIL_FROM=noreply@your-domain.com

# SMS Configuration (optional)
SMS_PROVIDER=twilio
TWILIO_ACCOUNT_SID=your-twilio-account-sid
TWILIO_AUTH_TOKEN=your-twilio-auth-token
TWILIO_PHONE_NUMBER=+1234567890

# Application Configuration
APP_NAME=CRM Restaurante
APP_VERSION=1.0.0
NODE_ENV=production
DEFAULT_TIMEZONE=Europe/Madrid

# File Upload Configuration
UPLOAD_DIR=./public/uploads
MAX_FILE_SIZE=5242880

# Analytics (optional)
GOOGLE_ANALYTICS_ID=GA-XXXXXXXXX

# Monitoring (optional)
SENTRY_DSN=your-sentry-dsn-here
```

## Docker Compose Template for EasyPanel

Create a `docker-compose.easypanel.yml` file with this content:

```yaml
version: '3.8'

services:
  app:
    build:
      context: .
      dockerfile: Dockerfile
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=${DATABASE_URL}
      - REDIS_URL=${REDIS_URL}
      - NEXT_PUBLIC_APP_URL=${NEXT_PUBLIC_APP_URL}
      - JWT_SECRET=${JWT_SECRET}
      - REFRESH_TOKEN_SECRET=${REFRESH_TOKEN_SECRET}
      - NEXTAUTH_URL=${NEXTAUTH_URL}
      - NEXTAUTH_SECRET=${NEXTAUTH_SECRET}
      - EMAIL_HOST=${EMAIL_HOST}
      - EMAIL_PORT=${EMAIL_PORT}
      - EMAIL_USER=${EMAIL_USER}
      - EMAIL_PASSWORD=${EMAIL_PASSWORD}
      - EMAIL_FROM=${EMAIL_FROM}
      - SENTRY_DSN=${SENTRY_DSN}
      - SMS_PROVIDER=${SMS_PROVIDER}
      - TWILIO_ACCOUNT_SID=${TWILIO_ACCOUNT_SID}
      - TWILIO_AUTH_TOKEN=${TWILIO_AUTH_TOKEN}
      - TWILIO_PHONE_NUMBER=${TWILIO_PHONE_NUMBER}
      - APP_NAME=${APP_NAME}
      - DEFAULT_TIMEZONE=${DEFAULT_TIMEZONE}
      - UPLOAD_DIR=${UPLOAD_DIR}
      - MAX_FILE_SIZE=${MAX_FILE_SIZE}
    volumes:
      - uploads_data:/app/public/uploads
      - backups_data:/app/backups
    restart: unless-stopped
    deploy:
      resources:
        limits:
          memory: 1G
        reservations:
          memory: 512M
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000/api/health"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s

  # PostgreSQL Service (only for Option 2)
  postgres:
    image: postgres:15-alpine
    environment:
      - POSTGRES_DB=restaurant_crm
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=${POSTGRES_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./docker/postgres/init.sql:/docker-entrypoint-initdb.d/init.sql
      - backups_data:/backups
    restart: unless-stopped
    deploy:
      resources:
        limits:
          memory: 512M
        reservations:
          memory: 256M
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 30s

  # Redis Service (only for Option 2)
  redis:
    image: redis:7-alpine
    command: redis-server --appendonly yes --requirepass ${REDIS_PASSWORD}
    volumes:
      - redis_data:/data
    restart: unless-stopped
    deploy:
      resources:
        limits:
          memory: 256M
        reservations:
          memory: 128M
    healthcheck:
      test: ["CMD", "redis-cli", "--raw", "incr", "ping"]
      interval: 30s
      timeout: 10s
      retries: 3

volumes:
  postgres_data:
    driver: local
  redis_data:
    driver: local
  uploads_data:
    driver: local
  backups_data:
    driver: local

networks:
  default:
    driver: bridge
```

## Database Initialization Script

Create a `scripts/easypanel-init-db.sh` script:

```bash
#!/bin/bash

# Database initialization script for EasyPanel
# This script will be executed when the application starts

set -e  # Exit on error

echo "Starting database initialization process..."

# Function to check if database is ready
check_database() {
    if [ -n "$DATABASE_URL" ]; then
        # Extract host and port from DATABASE_URL
        DB_HOST=$(echo $DATABASE_URL | sed -n 's/.*@\([^:]*\):.*/\1/p')
        DB_PORT=$(echo $DATABASE_URL | sed -n 's/.*:\([0-9]*\)\/.*/\1/p')
        
        echo "Checking database connection to $DB_HOST:$DB_PORT..."
        until nc -z $DB_HOST $DB_PORT; do
            echo "Database is unavailable - sleeping"
            sleep 2
        done
    else
        echo "DATABASE_URL not set, skipping database check"
        exit 1
    fi
}

# Function to run migrations
run_migrations() {
    echo "Generating Prisma client..."
    npx prisma generate
    
    echo "Running database migrations..."
    npx prisma migrate deploy
    
    echo "Checking if database needs seeding..."
    # Check if there are any users in the database
    USER_COUNT=$(npx prisma db execute --stdin <<< "SELECT COUNT(*) FROM \"users\";" 2>/dev/null || echo "0")
    
    if [ "$USER_COUNT" -eq 0 ]; then
        echo "Database is empty, seeding initial data..."
        npx prisma db seed
    else
        echo "Database already contains data, skipping seeding"
    fi
}

# Check if database is ready
check_database

echo "Database is ready!"

# Run migrations and seeding
run_migrations

echo "Database initialization completed successfully!"
```

## EasyPanel Deployment Script

Create a `scripts/easypanel-deploy.sh` script:

```bash
#!/bin/bash

# EasyPanel deployment script

set -e  # Exit on error

echo "Starting EasyPanel deployment process..."

# Configuration
APP_NAME="crm-restaurant"
BUILD_DIR="/tmp/easypanel-build"
DEPLOYMENT_LOG="/var/log/easypanel-deployment.log"

# Create deployment log directory
mkdir -p $(dirname $DEPLOYMENT_LOG)

# Log function
log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a $DEPLOYMENT_LOG
}

# Function to check if application is healthy
check_health() {
    local max_attempts=30
    local attempt=1
    
    log "Checking application health..."
    
    while [ $attempt -le $max_attempts ]; do
        if curl -f http://localhost:3000/api/health > /dev/null 2>&1; then
            log "Application is healthy!"
            return 0
        fi
        
        log "Attempt $attempt/$max_attempts: Application not ready yet..."
        sleep 10
        ((attempt++))
    done
    
    log "ERROR: Application failed to become healthy after $max_attempts attempts"
    return 1
}

# Create backup before deployment
log "Creating backup before deployment..."
./scripts/easypanel-backup.sh

# Build application
log "Building application..."
npm ci --only=production
npm run build

# Initialize database
log "Initializing database..."
./scripts/easypanel-init-db.sh

# Check application health
if check_health; then
    log "Deployment completed successfully!"
    
    # Log deployment info
    log "Deployment info:"
    log "- Application: $APP_NAME"
    log "- Version: $(git rev-parse --short HEAD 2>/dev/null || echo 'unknown')"
    log "- Deployed at: $(date)"
    log "- Health check: PASSED"
    
    exit 0
else
    log "ERROR: Deployment failed - health check failed"
    exit 1
fi
```

## Backup Script for EasyPanel

Create a `scripts/easypanel-backup.sh` script:

```bash
#!/bin/bash

# Backup script for EasyPanel deployment

set -e  # Exit on error

echo "Starting backup process..."

# Configuration
BACKUP_DIR="/backups"
DATE=$(date +%Y%m%d_%H%M%S)
DB_BACKUP_FILE="$BACKUP_DIR/db_backup_$DATE.sql"
FILES_BACKUP_FILE="$BACKUP_DIR/files_backup_$DATE.tar.gz"

# Create backup directory
mkdir -p $BACKUP_DIR

# Function to backup database
backup_database() {
    if [ -n "$DATABASE_URL" ]; then
        echo "Creating database backup..."
        pg_dump $DATABASE_URL > $DB_BACKUP_FILE
        echo "Database backup created: $DB_BACKUP_FILE"
        
        # Compress the backup
        gzip $DB_BACKUP_FILE
        echo "Database backup compressed: $DB_BACKUP_FILE.gz"
    else
        echo "DATABASE_URL not set, skipping database backup"
    fi
}

# Function to backup files
backup_files() {
    if [ -d "./public/uploads" ]; then
        echo "Creating files backup..."
        tar -czf $FILES_BACKUP_FILE -C ./public uploads
        echo "Files backup created: $FILES_BACKUP_FILE"
    else
        echo "Uploads directory not found, skipping files backup"
    fi
}

# Function to cleanup old backups
cleanup_old_backups() {
    echo "Cleaning up old backups (keeping last 30 days)..."
    find $BACKUP_DIR -name "db_backup_*.sql.gz" -mtime +30 -delete
    find $BACKUP_DIR -name "files_backup_*.tar.gz" -mtime +30 -delete
    echo "Old backups cleaned up"
}

# Run backup functions
backup_database
backup_files
cleanup_old_backups

echo "Backup process completed successfully!"
```

## GitHub Actions Workflow

Create a `.github/workflows/easypanel-deploy.yml` file:

```yaml
name: Deploy to EasyPanel

on:
  push:
    branches: [ main ]
  workflow_dispatch:

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '20'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Run tests
      run: npm test
    
    - name: Run type check
      run: npm run type-check
    
    - name: Run linting
      run: npm run lint

  deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '20'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Build application
      run: npm run build
    
    - name: Deploy to EasyPanel
      run: |
        curl -X POST "${{ secrets.EASYPANEL_API_URL }}/deploy" \
          -H "Authorization: Bearer ${{ secrets.EASYPANEL_TOKEN }}" \
          -H "Content-Type: application/json" \
          -d '{
            "repository": "${{ github.repository }}",
            "branch": "${{ github.ref_name }}",
            "commit": "${{ github.sha }}"
          }'
    
    - name: Notify deployment
      run: |
        echo "Deployment to EasyPanel initiated successfully!"
        echo "Repository: ${{ github.repository }}"
        echo "Branch: ${{ github.ref_name }}"
        echo "Commit: ${{ github.sha }}"
```

## Next.js Configuration Update

Update your `next.config.ts` for EasyPanel:

```typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable standalone output for Docker
  output: 'standalone',
  
  // Optimize images
  images: {
    domains: [
      'localhost',
      'your-app.easypanel.io', // Replace with your actual EasyPanel domain
    ],
    unoptimized: true, // Required for standalone output
  },
  
  // Security headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
        ],
      },
    ];
  },
  
  // Compression
  compress: true,
  
  // Environment variables
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },
};

export default nextConfig;
```

## Prisma Schema Update

Update your `prisma/schema.prisma` for production:

```prisma
// This is your Prisma schema file,
// learn more about it in the docs: https://pris.ly/d/prisma-schema

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// ... rest of your schema remains the same
```

## Dockerfile Update for EasyPanel

Update your `Dockerfile` for EasyPanel compatibility:

```dockerfile
# Multi-stage build for production optimization
# Stage 1: Install dependencies
FROM node:20-alpine AS deps
RUN apk add --no-cache libc6-compat curl
WORKDIR /app

# Copy package files
COPY package.json package-lock.json ./
RUN npm ci --only=production && npm cache clean --force

# Stage 2: Build the application
FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Build the application
ENV NEXT_TELEMETRY_DISABLED 1
RUN npm run build

# Stage 3: Production image
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

# Install curl for health checks
RUN apk add --no-cache curl

# Create non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy built application
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# Copy Prisma files for database operations
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma

# Copy scripts
COPY --from=builder /app/scripts ./scripts
RUN chmod +x scripts/*.sh

# Create uploads and backups directory with proper permissions
RUN mkdir -p /app/public/uploads /app/backups && chown -R nextjs:nodejs /app/public/uploads /app/backups

# Set correct permissions
USER nextjs

# Expose port
EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000/api/health || exit 1

# Start the application
CMD ["node", "server.js"]
```

## How to Use These Templates

1. Copy the environment variables to your EasyPanel configuration
2. Create the `docker-compose.easypanel.yml` file in your project root
3. Add the scripts to your `scripts/` directory
4. Update your `next.config.ts` and `Dockerfile` if needed
5. Set up the GitHub Actions workflow if you want automated deployments
6. Follow the deployment steps in the main deployment guide

Remember to replace placeholder values (like `your-app.easypanel.io`) with your actual values provided by EasyPanel.