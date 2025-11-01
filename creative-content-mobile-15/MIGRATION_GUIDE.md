# Database Migration System Guide

## Overview
ViraLink uses an automated database migration system that runs migrations during deployment with Slack and email notifications. This ensures database schema changes are version-controlled, automatically applied, and monitored.

## Features
- ✅ Automatic migration execution during deployment
- ✅ Separate staging and production environments
- ✅ Migration versioning and tracking
- ✅ Rollback capabilities
- ✅ Slack notifications for success/failure
- ✅ Email notifications with rollback instructions
- ✅ Execution time tracking

## Migration Structure

### Migration Files
- **Location**: `supabase/migrations/`
- **Naming**: `XXX_description.sql` (e.g., `001_create_profiles_table.sql`)
- **Versioning**: Sequential numbers ensure correct execution order

### Rollback Files
- **Location**: `supabase/migrations/rollback/`
- **Naming**: `XXX_description_rollback.sql`
- **Purpose**: Undo changes if migration fails or needs reverting

## Creating a New Migration

### 1. Create Migration File
```bash
# Create new migration file with next sequential number
touch supabase/migrations/003_add_new_feature.sql
```

### 2. Write Migration SQL
```sql
-- Example: supabase/migrations/003_add_posts_table.sql
CREATE TABLE posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view own posts" ON posts
  FOR SELECT USING (auth.uid() = user_id);
```

### 3. Create Rollback File
```bash
touch supabase/migrations/rollback/003_add_posts_table_rollback.sql
```
