# Environment Configuration for Database Migrations

## Overview
This guide explains how to configure environment variables and secrets for automated database migrations in your CI/CD pipeline.

## GitHub Secrets Configuration

### Required Secrets

Add these secrets to your GitHub repository (Settings → Secrets and variables → Actions):

#### 1. Supabase Access Token
```
SUPABASE_ACCESS_TOKEN
```
- Get from: https://app.supabase.com/account/tokens
- Used for: Authenticating Supabase CLI in GitHub Actions

#### 2. Production Database URL
```
PRODUCTION_DB_URL
```
Format: `postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres`

To get your production DB URL:
1. Go to Supabase Dashboard → Project Settings → Database
2. Find "Connection string" under "Connection pooling"
3. Copy the URI and replace `[YOUR-PASSWORD]` with your database password
4. Use the secret `PRODUCTION_DB_PASSWORD` you already have

#### 3. Staging Database URL
```
STAGING_DB_URL
```
Same format as production, but for your staging Supabase project.

#### 4. Slack Webhook URL (Optional)
```
SLACK_WEBHOOK_URL
```
- Get from: https://api.slack.com/apps → Your App → Incoming Webhooks
- Used for: Sending migration notifications to Slack
- See: NOTIFICATION_SETUP_GUIDE.md for detailed setup

#### 5. Email Notification Settings (Optional)
```
NOTIFICATION_EMAIL
MAIL_SERVER
MAIL_PORT
MAIL_USERNAME
MAIL_PASSWORD
```
- Used for: Sending migration notifications via email
- See: NOTIFICATION_SETUP_GUIDE.md for detailed setup
