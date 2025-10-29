# Deployment Guide for viralink.pro

## Issue: GoDaddy "Launching Soon" Page

If you're seeing GoDaddy's "launching soon" page, it means your domain DNS is not configured to point to your deployed application.

## Quick Fix Steps

### Option 1: Deploy to Netlify (Recommended)

1. **Deploy the app:**
   - Go to [netlify.com](https://netlify.com) and sign in
   - Click "Add new site" → "Import an existing project"
   - Connect your Git repository
   - Netlify will auto-detect settings from `netlify.toml`
   - Add environment variables in Site Settings → Environment Variables:
     - `VITE_SUPABASE_URL`
     - `VITE_SUPABASE_ANON_KEY`
     - `VITE_STRIPE_PUBLISHABLE_KEY`
   - Click "Deploy"

2. **Connect your domain:**
   - In Netlify: Site Settings → Domain Management → Add custom domain
   - Enter `viralink.pro`
   - Netlify will provide DNS records

3. **Update GoDaddy DNS:**
   - Log into GoDaddy
   - Go to My Products → Domains → DNS
   - Update nameservers to Netlify's (recommended) OR
   - Add A record pointing to Netlify's IP
   - Add CNAME for www pointing to your-site.netlify.app

### Option 2: Deploy to Vercel

1. **Deploy:**
   - Go to [vercel.com](https://vercel.com)
   - Import your Git repository
   - Vercel will detect settings from `vercel.json`
   - Add environment variables

2. **Connect domain:**
   - Project Settings → Domains → Add
   - Follow Vercel's DNS instructions for GoDaddy

## DNS Propagation

After updating DNS, it can take 24-48 hours for changes to propagate globally, but often works within 1-2 hours.

## Troubleshooting

- **Still seeing GoDaddy page?** Clear browser cache or try incognito mode
- **DNS not updating?** Use [whatsmydns.net](https://whatsmydns.net) to check propagation
- **Build failing?** Check that all environment variables are set correctly
