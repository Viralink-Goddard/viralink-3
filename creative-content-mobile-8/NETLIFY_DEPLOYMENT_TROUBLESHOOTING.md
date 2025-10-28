# Netlify Deployment Troubleshooting for viralink.pro

## Quick Checklist

### 1. Check Build Status in Netlify Dashboard
1. Go to https://app.netlify.com
2. Find your site
3. Click on "Deploys" tab
4. Check if the latest deploy shows:
   - ✅ **Published** (green) - Site is live
   - ⚠️ **Building** (yellow) - Still deploying
   - ❌ **Failed** (red) - Build error

### 2. Required Environment Variables
In Netlify Dashboard → Site Settings → Environment Variables, add:

```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_or_pk_live_key
VITE_STRIPE_PRICE_ID=price_your_price_id
VITE_OPENAI_API_KEY=your_openai_key (optional for AI features)
```

**CRITICAL**: Without these, the build will succeed but the app won't work!

### 3. Domain Configuration (viralink.pro)
In Netlify Dashboard → Domain Settings:

1. **Add Custom Domain**: viralink.pro
2. **DNS Configuration** (in your domain registrar):
   ```
   Type: A Record
   Name: @
   Value: 75.2.60.5 (Netlify's load balancer)

   Type: CNAME
   Name: www
   Value: your-site-name.netlify.app
   ```
3. **Enable HTTPS**: Netlify auto-provisions SSL (takes 1-24 hours)

### 4. Common Build Errors

#### Error: "Build failed"
- Check deploy logs for specific error
- Usually missing dependencies or TypeScript errors

#### Error: "Command failed with exit code 1"
- Environment variables missing
- Run locally: `npm install && npm run build` to test

#### Site shows blank page
- Open browser console (F12)
- Check for errors
- Usually means environment variables are missing

### 5. Verify Build Settings
In Netlify Dashboard → Site Settings → Build & Deploy:

```
Build command: npm run build
Publish directory: dist
Node version: 18
```

### 6. Test Locally First
```bash
# Install dependencies
npm install

# Build the project
npm run build

# Preview the build
npm run preview
```

If this works locally, it should work on Netlify.

### 7. Force Redeploy
Sometimes Netlify needs a fresh deploy:
1. Go to Deploys tab
2. Click "Trigger deploy" → "Clear cache and deploy site"

### 8. Check Deploy Logs
1. Click on the failed/building deploy
2. Read the full log
3. Look for errors in red
4. Common issues:
   - Missing dependencies
   - TypeScript errors
   - Environment variable references

## Quick Fix Commands

If you need to redeploy from your local machine:
```bash
# Make sure everything is committed
git add .
git commit -m "Fix deployment"
git push origin main
```

## Still Not Working?

1. **Check Netlify Status**: https://www.netlifystatus.com/
2. **DNS Propagation**: Use https://dnschecker.org to verify viralink.pro points to Netlify
3. **Contact Support**: Netlify support is very responsive

## Expected Timeline
- Build: 2-5 minutes
- DNS propagation: 1-48 hours (for custom domain)
- SSL certificate: 1-24 hours

Your site should be accessible at:
- https://your-site-name.netlify.app (immediate)
- https://viralink.pro (after DNS propagates)
