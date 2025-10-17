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
        
        # Install nc if not available
        if ! command -v nc &> /dev/null; then
            echo "Installing netcat..."
            apk add --no-cache netcat-openbsd
        fi
        
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
    USER_COUNT=$(npx prisma db execute --stdin --schema=./prisma/schema.prisma <<< "SELECT COUNT(*) FROM \"users\";" 2>/dev/null || echo "0")
    
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