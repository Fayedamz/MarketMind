#!/bin/bash

# Database Backup Script for MarketMind

BACKUP_DIR="./backups"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_FILE="$BACKUP_DIR/marketmind_backup_$TIMESTAMP.sql"

# Create backup directory if it doesn't exist
mkdir -p $BACKUP_DIR

echo "🔄 Starting database backup..."

# Get database URL from environment
if [ -f "apps/api/.env" ]; then
    export $(cat apps/api/.env | grep DATABASE_URL | xargs)
fi

# Perform backup
pg_dump $DATABASE_URL > $BACKUP_FILE

if [ $? -eq 0 ]; then
    echo "✅ Backup completed successfully: $BACKUP_FILE"
    
    # Compress backup
    gzip $BACKUP_FILE
    echo "✅ Backup compressed: $BACKUP_FILE.gz"
    
    # Clean old backups (keep last 7 days)
    find $BACKUP_DIR -name "*.sql.gz" -mtime +7 -delete
    echo "🧹 Old backups cleaned"
else
    echo "❌ Backup failed"
    exit 1
fi
