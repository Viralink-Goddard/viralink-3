# Migration Notification Setup Guide

This guide explains how to set up Slack and email notifications for database migrations in your CI/CD pipeline.

## Overview

The ViraLink CI/CD pipeline sends notifications when:
- ✅ Database migrations succeed
- ❌ Database migrations fail
- ✅ Migration rollbacks succeed
- ❌ Migration rollbacks fail

Notifications include:
- Environment (staging/production)
- Execution time
- Timestamp
- Who triggered the migration
- Commit details
- Rollback instructions (for failures)

## Slack Notifications Setup

### 1. Create a Slack Incoming Webhook

1. Go to https://api.slack.com/apps
2. Click "Create New App" → "From scratch"
3. Name your app (e.g., "ViraLink CI/CD")
4. Select your workspace
5. Click "Incoming Webhooks" in the sidebar
6. Toggle "Activate Incoming Webhooks" to ON
7. Click "Add New Webhook to Workspace"
8. Select the channel for notifications (e.g., #deployments)
9. Copy the webhook URL (starts with `https://hooks.slack.com/services/`)

### 2. Add Webhook to GitHub Secrets

1. Go to your GitHub repository
2. Navigate to Settings → Secrets and variables → Actions
3. Click "New repository secret"
4. Name: `SLACK_WEBHOOK_URL`
5. Value: Paste your webhook URL
6. Click "Add secret"

## Email Notifications Setup

### Option 1: Gmail (Recommended for Testing)

1. **Enable 2-Factor Authentication** on your Gmail account
2. **Generate App Password**:
   - Go to Google Account → Security
   - Under "2-Step Verification", click "App passwords"
   - Select "Mail" and "Other (Custom name)"
   - Name it "ViraLink CI/CD"
   - Copy the 16-character password

3. **Add to GitHub Secrets**:
   ```
   MAIL_SERVER=smtp.gmail.com
   MAIL_PORT=587
   MAIL_USERNAME=your-email@gmail.com
   MAIL_PASSWORD=your-16-char-app-password
   NOTIFICATION_EMAIL=team@example.com
   ```

### Option 2: SendGrid

1. Create a SendGrid account at https://sendgrid.com
2. Generate an API key
3. Add to GitHub Secrets:
   ```
   MAIL_SERVER=smtp.sendgrid.net
   MAIL_PORT=587
   MAIL_USERNAME=apikey
   MAIL_PASSWORD=your-sendgrid-api-key
   NOTIFICATION_EMAIL=team@example.com
   ```

### Option 3: Custom SMTP Server

Add your SMTP server details to GitHub Secrets:
```
MAIL_SERVER=smtp.yourserver.com
MAIL_PORT=587 (or 465 for SSL)
MAIL_USERNAME=your-username
MAIL_PASSWORD=your-password
NOTIFICATION_EMAIL=team@example.com
```

## GitHub Secrets Configuration

Add all required secrets to your repository:

1. Go to Settings → Secrets and variables → Actions
2. Add the following secrets:

### Required for Slack:
- `SLACK_WEBHOOK_URL` - Your Slack webhook URL

### Required for Email:
- `MAIL_SERVER` - SMTP server address
- `MAIL_PORT` - SMTP port (usually 587 or 465)
- `MAIL_USERNAME` - SMTP username
- `MAIL_PASSWORD` - SMTP password or app password
- `NOTIFICATION_EMAIL` - Email address to receive notifications

## Notification Examples

### Success Notification (Slack)
```
✅ Production Migration Successful

Environment: Production
Execution Time: 3s
Timestamp: 2025-10-16 18:30:00 UTC
Triggered By: john-doe
Commit: abc123def
Branch: main

[View Details]
```

### Failure Notification (Email)
```
Subject: ❌ Production Migration Failed - ViraLink - ACTION REQUIRED

⚠️ PRODUCTION DATABASE MIGRATION FAILED ⚠️

Environment: Production
Execution Time: 5s
Timestamp: 2025-10-16 18:30:00 UTC
Triggered By: john-doe
Commit: abc123def
Branch: main

ROLLBACK INSTRUCTIONS:
1. Go to: https://github.com/your-repo/actions/workflows/migration-rollback.yml
2. Click "Run workflow"
3. Enter the migration version to rollback to
4. Select "production" as the environment
5. Click "Run workflow" to execute rollback

Error Details: [link]
```

## Testing Notifications

### Test Slack Notifications
```bash
curl -X POST -H 'Content-type: application/json' \
  --data '{"text":"Test notification from ViraLink CI/CD"}' \
  YOUR_SLACK_WEBHOOK_URL
```

### Test Email Configuration
Push a test commit to the staging branch and verify email delivery.

## Troubleshooting

### Slack Notifications Not Received
- Verify webhook URL is correct in GitHub Secrets
- Check the Slack channel permissions
- Ensure the webhook is active in Slack app settings

### Email Notifications Not Received
- Check spam/junk folder
- Verify SMTP credentials are correct
- For Gmail: Ensure app password is used (not regular password)
- Check MAIL_PORT (587 for TLS, 465 for SSL)
- Verify NOTIFICATION_EMAIL is correct

### Notification Step Fails in GitHub Actions
- Check GitHub Actions logs for specific error
- Verify all required secrets are set
- Ensure secret names match exactly (case-sensitive)

## Disabling Notifications

To disable notifications temporarily:

1. Comment out notification steps in workflow files:
   - `.github/workflows/deploy-production.yml`
   - `.github/workflows/deploy-staging.yml`
   - `.github/workflows/migration-rollback.yml`

2. Or remove the GitHub Secrets to prevent notifications from being sent

## Best Practices

1. **Use Dedicated Channels**: Create separate Slack channels for staging and production
2. **Set Up Alerts**: Configure Slack to alert on-call engineers for production failures
3. **Email Distribution Lists**: Use team email lists instead of individual emails
4. **Test First**: Always test notifications in staging before enabling in production
5. **Monitor Delivery**: Regularly check that notifications are being received

## Support

For issues with notifications:
1. Check GitHub Actions logs
2. Verify all secrets are configured correctly
3. Test webhook/SMTP connection manually
4. Review this guide for configuration steps
