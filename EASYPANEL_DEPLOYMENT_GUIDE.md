# EasyPanel Deployment Guide for CRM Restaurante

This guide provides step-by-step instructions for deploying the CRM Restaurante application to EasyPanel.

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Deployment Options](#deployment-options)
3. [Configuration Files](#configuration-files)
4. [Environment Variables](#environment-variables)
5. [Database Setup](#database-setup)
6. [Deployment Steps](#deployment-steps)
7. [Post-Deployment Configuration](#post-deployment-configuration)
8. [Backup and Recovery](#backup-and-recovery)
9. [Troubleshooting](#troubleshooting)

## Prerequisites

Before starting the deployment, ensure you have:
- An active EasyPanel account
- A server with EasyPanel installed
- Access to create databases and services
- Your application URL provided by EasyPanel
- GitHub repository with your code

## Deployment Options

### Option 1: Using EasyPanel's Managed Database Services (Recommended)

**Pros:**
- Automatic backups and maintenance
- Better performance and reliability
- Easier monitoring through EasyPanel dashboard
- Less infrastructure to manage
- SSL/TLS connections included

**Cons:**
- May have additional costs
- Less control over database configuration
- Potential vendor lock-in

### Option 2: Using Docker Containers from docker-compose.prod.yml

**Pros:**
- No additional database service costs
- Full control over database configuration
- Can customize extensions and settings
- Data stays within your deployment environment

**Cons:**
- You're responsible for backups and maintenance
- Need to manage database updates and security
- May require more server resources
- Monitoring is more complex

## Configuration Files

### 1. EasyPanel Service Configuration

Create a new service in EasyPanel with the following configuration:

```json
{
  "name": "CRM Restaurante",
  "description": "Sistema de gestión de reservas para restaurantes",
  "image": "crm-restaurant:latest",
  "ports": {
    "3000": "3000"
  },
  "volumes": {
    "/app/public/uploads": "/var/www/uploads",
    "/app/backups": "/backups"
  },
  "environment": {
    "NODE_ENV": "production",
    "DATABASE_URL": "${DATABASE_URL}",
    "REDIS_URL": "${REDIS_URL}",
    "JWT_SECRET": "${JWT_SECRET}",
    "REFRESH_TOKEN_SECRET": "${REFRESH_TOKEN_SECRET}",
    "NEXTAUTH_SECRET": "${NEXTAUTH_SECRET}",
    "NEXTAUTH_URL": "${NEXTAUTH_URL}",
    "NEXT_PUBLIC_APP_URL": "${NEXT_PUBLIC_APP_URL}",
    "EMAIL_HOST": "${EMAIL_HOST}",
    "EMAIL_PORT": "${EMAIL_PORT}",
    "EMAIL_USER": "${EMAIL_USER}",
    "EMAIL_PASSWORD": "${EMAIL_PASSWORD}",
    "EMAIL_FROM": "${EMAIL_FROM}",
    "SENTRY_DSN": "${SENTRY_DSN}"
  },
  "healthCheck": {
    "path": "/api/health",
    "interval": 30,
    "timeout": 10,
    "retries": 3
  },
  "resources": {
    "memory": "1G",
    "cpu": "0.5"
  }
}
```

### 2. Production Docker Compose for EasyPanel

Create a `docker-compose.easypanel.yml` file:

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

volumes:
  uploads_data:
    driver: local
  backups_data:
    driver: local

networks:
  default:
    driver: bridge
```

## Environment Variables

### Required Environment Variables

Create these environment variables in EasyPanel:

```bash
# Application URL (replace with your EasyPanel URL)
NEXTAUTH_URL=https://your-app.easypanel.io
NEXT_PUBLIC_APP_URL=https://your-app.easypanel.io

# Database (for Option 1 - EasyPanel Managed)
DATABASE_URL=postgresql://username:password@host:port/database_name
REDIS_URL=redis://username:password@host:port

# Database (for Option 2 - Docker Containers)
DATABASE_URL=postgresql://postgres:${POSTGRES_PASSWORD}@postgres:5432/restaurant_crm
REDIS_URL=redis://redis:6379

# Security
JWT_SECRET=your-super-secure-jwt-secret-key-here
REFRESH_TOKEN_SECRET=your-super-secure-refresh-token-secret-here
NEXTAUTH_SECRET=your-super-secure-nextauth-secret-here

# Email Configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
EMAIL_FROM=noreply@your-domain.com

# Optional
SENTRY_DSN=your-sentry-dsn-here
```

### Security Notes

1. Use strong, unique secrets for all JWT and auth secrets
2. Store email passwords securely
3. Use environment-specific values for production

## Database Setup

### Option 1: Using EasyPanel's Managed Database Services

1. Create a PostgreSQL database in EasyPanel
2. Create a Redis service in EasyPanel
3. Get the connection strings and update environment variables
4. Run database migrations using the EasyPanel terminal or initialization script

### Option 2: Using Docker Containers

1. Add PostgreSQL and Redis services to your EasyPanel deployment
2. Use the provided `docker-compose.easypanel.yml` configuration
3. Initialize the database with the following script:

```bash
#!/bin/bash
# Database initialization script for EasyPanel

# Wait for database to be ready
echo "Waiting for database to be ready..."
until nc -z postgres 5432; do
    echo "Database is unavailable - sleeping"
    sleep 1
done

echo "Database is ready!"

# Generate Prisma client
echo "Generating Prisma client..."
npx prisma generate

# Run migrations
echo "Running database migrations..."
npx prisma migrate deploy

# Seed the database
echo "Seeding database..."
npx prisma db seed

echo "Database initialization completed!"
```

## Deployment Steps

### 1. Prepare Your Code

1. Update your GitHub repository with the latest code
2. Ensure all environment variables are properly configured
3. Update the `next.config.ts` if needed for production:

```typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  images: {
    domains: ['your-app.easypanel.io'], // Update with your actual domain
    unoptimized: true,
  },
  // ... rest of the configuration
};

export default nextConfig;
```

### 2. Create EasyPanel Application

1. Log in to your EasyPanel dashboard
2. Create a new application
3. Connect it to your GitHub repository
4. Configure the build settings:
   - Build Command: `npm run build`
   - Start Command: `npm start`
   - Node Version: `20.x`

### 3. Configure Environment Variables

1. Add all required environment variables in EasyPanel
2. Ensure database connection strings are correct
3. Verify all secrets are properly set

### 4. Deploy the Application

1. Trigger a deployment in EasyPanel
2. Monitor the build logs
3. Check the application health endpoint
4. Verify all services are running

### 5. Run Database Migrations

If using managed databases, run migrations manually:

```bash
# In EasyPanel terminal
npx prisma migrate deploy
npx prisma db seed
```

## Post-Deployment Configuration

### 1. SSL Certificate

EasyPanel typically handles SSL automatically, but verify:
- HTTPS is working correctly
- All resources load over HTTPS
- No mixed content warnings

### 2. Performance Optimization

1. Enable caching in EasyPanel
2. Configure CDN if available
3. Monitor resource usage
4. Set up alerts for high resource usage

### 3. Monitoring and Logging

1. Configure log retention in EasyPanel
2. Set up monitoring dashboards
3. Create alerts for errors and performance issues
4. Test all critical functionality

## Backup and Recovery

### Automated Backups

Configure EasyPanel to automatically backup:
1. Database (daily)
2. Uploaded files (weekly)
3. Application configuration

### Manual Backup Script

```bash
#!/bin/bash
# Manual backup script for EasyPanel

BACKUP_DIR="/backups"
DATE=$(date +%Y%m%d_%H%M%S)
DB_BACKUP_FILE="$BACKUP_DIR/db_backup_$DATE.sql"
FILES_BACKUP_FILE="$BACKUP_DIR/files_backup_$DATE.tar.gz"

# Create database backup
pg_dump $DATABASE_URL > $DB_BACKUP_FILE

# Create files backup
tar -czf $FILES_BACKUP_FILE /app/public/uploads

# Keep only last 30 days of backups
find $BACKUP_DIR -name "*.sql" -mtime +30 -delete
find $BACKUP_DIR -name "*.tar.gz" -mtime +30 -delete

echo "Backup completed: $DATE"
```

### Recovery Procedure

1. Stop the application in EasyPanel
2. Restore database from backup:
   ```bash
   psql $DATABASE_URL < /backups/db_backup_YYYYMMDD_HHMMSS.sql
   ```
3. Restore uploaded files if needed:
   ```bash
   tar -xzf /backups/files_backup_YYYYMMDD_HHMMSS.tar.gz
   ```
4. Restart the application

## Troubleshooting

### Common Issues

1. **Application won't start**
   - Check environment variables
   - Verify database connection
   - Review deployment logs

2. **Database connection errors**
   - Verify connection string format
   - Check database service status
   - Ensure firewall allows connections

3. **Authentication issues**
   - Verify NEXTAUTH_URL matches your domain
   - Check NEXTAUTH_SECRET is set
   - Review JWT configuration

4. **File upload issues**
   - Verify uploads directory permissions
   - Check disk space
   - Review file size limits

### Debugging Commands

```bash
# Check application logs
docker-compose logs -f app

# Check database connection
npx prisma db pull

# Test health endpoint
curl https://your-app.easypanel.io/api/health

# Check environment variables
printenv | grep -E "(DATABASE|REDIS|JWT|NEXTAUTH)"
```

## GitHub Actions Deployment (Optional)

Create a `.github/workflows/deploy.yml` file for automated deployments:

```yaml
name: Deploy to EasyPanel

on:
  push:
    branches: [ main ]

jobs:
  deploy:
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
    
    - name: Build application
      run: npm run build
    
    - name: Deploy to EasyPanel
      run: |
        curl -X POST "https://your-easypanel-instance.com/api/deploy" \
          -H "Authorization: Bearer ${{ secrets.EASYPANEL_TOKEN }}" \
          -H "Content-Type: application/json" \
          -d '{"repository": "your-username/crm-restaurant", "branch": "main"}'
```

## Final Checklist

Before going live, ensure:

- [ ] All environment variables are set
- [ ] Database migrations are applied
- [ ] SSL certificate is configured
- [ ] Backups are configured
- [ ] Monitoring is set up
- [ ] All critical functionality is tested
- [ ] Error handling is working
- [ ] Performance is acceptable
- [ ] Security headers are configured
- [ ] File uploads are working
- [ ] Email notifications are configured

## Support

If you encounter any issues during deployment:

1. Check the EasyPanel documentation
2. Review the application logs
3. Verify all configurations
4. Test with a minimal setup first
5. Contact EasyPanel support if needed