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
    
    # Install curl if not available
    if ! command -v curl &> /dev/null; then
        echo "Installing curl..."
        apk add --no-cache curl
    fi
    
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
if [ -f "./scripts/easypanel-backup.sh" ]; then
    ./scripts/easypanel-backup.sh
else
    log "Backup script not found, skipping backup"
fi

# Build application
log "Building application..."
npm ci --only=production
npm run build

# Initialize database
log "Initializing database..."
if [ -f "./scripts/easypanel-init-db.sh" ]; then
    chmod +x ./scripts/easypanel-init-db.sh
    ./scripts/easypanel-init-db.sh
else
    log "Database initialization script not found, skipping"
fi

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