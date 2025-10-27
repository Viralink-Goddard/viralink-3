# CI/CD Pipeline Setup Guide

This guide will help you set up automated deployment with GitHub Actions for your ViraLink application.

## Overview

The CI/CD pipeline includes:
- **Automated Testing**: Runs on every push and pull request
- **Database Migrations**: Automatically applies schema changes
- **Staging Environment**: Deploys to staging on `staging` branch
- **Production Environment**: Deploys to production on `main` branch
- **Quality Gates**: Tests must pass before deployment
- **Rollback Capability**: Manual workflow to revert migrations


## Prerequisites

1. GitHub repository with your code
2. Netlify account (or Vercel as alternative)
3. Supabase projects (production and staging)
4. Stripe accounts (production and test mode)

## Step 1: Create Staging Environment

### 1.1 Create Staging Supabase Project

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Create a new project named "viralink-staging"
3. Run the same migrations as your production database
4. Note the URL and anon key

### 1.2 Create Staging Netlify Site

1. Go to [Netlify Dashboard](https://app.netlify.com)
2. Create a new site (don't connect to Git yet)
3. Name it "viralink-staging"
4. Note the Site ID from Site Settings

## Step 2: Configure GitHub Secrets

Go to your GitHub repository → Settings → Secrets and variables → Actions

Add these secrets:

### Production Secrets
```
VITE_SUPABASE_URL=your_production_supabase_url
VITE_SUPABASE_ANON_KEY=your_production_anon_key
VITE_STRIPE_PUBLIC_KEY=your_production_stripe_key
NETLIFY_AUTH_TOKEN=your_netlify_personal_access_token
NETLIFY_SITE_ID=your_production_netlify_site_id
```

### Staging Secrets
```
VITE_SUPABASE_STAGING_URL=your_staging_supabase_url
VITE_SUPABASE_STAGING_ANON_KEY=your_staging_anon_key
VITE_STRIPE_STAGING_PUBLIC_KEY=your_stripe_test_key
NETLIFY_STAGING_SITE_ID=your_staging_netlify_site_id
```

### How to Get Netlify Auth Token
1. Go to Netlify → User Settings → Applications
2. Create a new Personal Access Token
3. Copy and save as `NETLIFY_AUTH_TOKEN`

## Step 3: Create Branch Structure

```bash
# Create staging branch
git checkout -b staging
git push -u origin staging

# Keep main as production branch
git checkout main
```

## Step 4: Workflow Behavior

### Test Workflow (`test.yml`)
- Runs on: Push to main, staging, develop
- Runs on: Pull requests to main, staging
- Actions: Lint → Test → Build

### Staging Deployment (`deploy-staging.yml`)
- Runs on: Push to `staging` branch
- Runs on: Pull requests to `main`
- Actions: Test → Deploy to staging Netlify site
- URL: `https://viralink-staging.netlify.app`

### Production Deployment (`deploy-production.yml`)
- Runs on: Push to `main` branch
- Actions: Test → Deploy to production Netlify site
- URL: `https://viralink.pro`

## Step 5: Development Workflow

### Feature Development
```bash
# Create feature branch
git checkout -b feature/new-feature

# Make changes and commit
git add .
git commit -m "Add new feature"

# Push and create PR to staging
git push origin feature/new-feature
```

### Testing in Staging
```bash
# Merge to staging for testing
git checkout staging
git merge feature/new-feature
git push origin staging
# This triggers staging deployment
```

### Deploy to Production
```bash
# After testing in staging, merge to main
git checkout main
git merge staging
git push origin main
# This triggers production deployment
```

## Step 6: Monitoring Deployments

### View Workflow Status
1. Go to GitHub repository → Actions tab
2. See all workflow runs and their status
3. Click on any run to see detailed logs

### Netlify Deploy Previews
- Each deployment creates a unique URL
- Check deployment logs in Netlify dashboard
- View build logs for debugging

## Troubleshooting

### Tests Failing
```bash
# Run tests locally first
npm test

# Run with coverage
npm run test:coverage

# Fix issues before pushing
```

### Build Failures
- Check environment variables are set correctly
- Verify all secrets in GitHub
- Check build logs in Actions tab

### Deployment Issues
- Verify Netlify auth token is valid
- Check Netlify site IDs are correct
- Ensure Supabase URLs are accessible

## Alternative: Vercel Deployment

If using Vercel instead of Netlify:

### Install Vercel CLI
```bash
npm i -g vercel
```

### Link Projects
```bash
# Production
vercel link --project=viralink-production

# Staging
vercel link --project=viralink-staging
```

### Update Workflows
Replace Netlify deployment steps with:
```yaml
- name: Deploy to Vercel
  run: vercel --prod --token=${{ secrets.VERCEL_TOKEN }}
  env:
    VERCEL_ORG_ID: ${{ secrets.VERCEL_ORG_ID }}
    VERCEL_PROJECT_ID: ${{ secrets.VERCEL_PROJECT_ID }}
```

## Best Practices

1. **Never commit directly to main** - Always use PRs
2. **Test in staging first** - Catch issues before production
3. **Keep staging and production in sync** - Same database schema
4. **Monitor deployments** - Check logs after each deploy
5. **Use semantic versioning** - Tag releases in main branch
6. **Rollback strategy** - Keep previous deployments available

## Security Notes

- Never commit `.env` files
- Rotate secrets regularly
- Use different Stripe keys for staging (test mode)
- Limit GitHub Actions permissions
- Review third-party actions before use

## Next Steps

1. Set up monitoring (e.g., Sentry)
2. Add performance testing
3. Implement automated database migrations
4. Set up automated backups
5. Configure custom domains for staging

## Support

- GitHub Actions Docs: https://docs.github.com/actions
- Netlify Docs: https://docs.netlify.com
- Supabase Docs: https://supabase.com/docs
