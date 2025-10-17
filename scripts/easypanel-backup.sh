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
        
        # Install postgres client if not available
        if ! command -v pg_dump &> /dev/null; then
            echo "Installing postgres client..."
            apk add --no-cache postgresql-client
        fi
        
        # Create database backup
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