#!/bin/bash

# Database Restore Script for MarketMind

if [ -z "$1" ]; then
    echo "Usage: ./restore-db.sh <backup_file.sql.gz>"
    echo "Available backups:"
    ls -1 backups/*.sql.gz 2>/dev/null || echo "No backups found"
    exit 1
fi

BACKUP_FILE=$1

echo "⚠️  WARNING: This will replace the current database!"
read -p "Are you sure you want to continue? (yes/no): " CONFIRM

if [ "$CONFIRM" != "yes" ]; then
    echo "Restore cancelled"
    exit 0
fi

echo "🔄 Starting database restore..."

# Get database URL from environment
if [ -f "apps/api/.env" ]; then
    export $(cat apps/api/.env | grep DATABASE_URL | xargs)
fi

# Decompress if needed
if [[ $BACKUP_FILE == *.gz ]]; then
    gunzip -c $BACKUP_FILE | psql $DATABASE_URL
else
    psql $DATABASE_URL < $BACKUP_FILE
fi

if [ $? -eq 0 ]; then
    echo "✅ Restore completed successfully"
else
    echo "❌ Restore failed"
    exit 1
fi
