#!/bin/bash
set -e

MIGRATION_FILE=$1
DB_URL=$2

if [ -z "$MIGRATION_FILE" ] || [ -z "$DB_URL" ]; then
  echo "Usage: ./rollback-migration.sh <migration_file> <db_url>"
  exit 1
fi

# Extract migration name without extension
MIGRATION_NAME="${MIGRATION_FILE%.sql}"

# Check if rollback file exists
ROLLBACK_FILE="supabase/migrations/rollback/${MIGRATION_NAME}_rollback.sql"

if [ ! -f "$ROLLBACK_FILE" ]; then
  echo "Error: Rollback file not found: $ROLLBACK_FILE"
  echo "Please create a rollback migration file first."
  exit 1
fi

echo "Rolling back migration: $MIGRATION_NAME"
echo "Using rollback file: $ROLLBACK_FILE"

# Execute rollback
psql "$DB_URL" -f "$ROLLBACK_FILE"

echo "✅ Migration rollback completed successfully"
