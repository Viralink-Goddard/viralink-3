# Viralink.pro - AI-Powered Social Media Management

A comprehensive social media management platform with AI-powered content creation, scheduling, and analytics.

## Features

- 🤖 AI-powered content generation
- 📅 Content scheduling across multiple platforms
- 📊 Analytics and performance tracking
- 💳 Stripe integration for subscriptions
- 📧 Email notification preferences
- 🔐 Secure authentication with Supabase

## Quick Start

### Demo Mode (No Setup Required)

The app runs in demo mode by default. Simply:

1. Install dependencies: `npm install`
2. Start the dev server: `npm run dev`
3. Click "Try Demo" button on the homepage to explore all features

### Production Setup (Full Authentication)

To enable real user authentication and database features:

1. **Create a Supabase Project**
   - Go to [supabase.com](https://supabase.com)
   - Create a new project
   - Copy your project URL and anon key

2. **Configure Environment Variables**
   ```bash
   cp .env.example .env
   ```
   
   Update `.env` with your credentials:
   ```
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   VITE_OPENAI_API_KEY=your_openai_api_key (optional)
   ```

3. **Run Database Migrations**
   ```bash
   # Install Supabase CLI
   npm install -g supabase
   
   # Link to your project
   supabase link --project-ref your-project-ref
   
   # Run migrations
   supabase db push
   ```

4. **Start Development**
   ```bash
   npm install
   npm run dev
   ```

## Environment Variables

See `.env.example` for all available configuration options.

Required for production:
- `VITE_SUPABASE_URL` - Your Supabase project URL
- `VITE_SUPABASE_ANON_KEY` - Your Supabase anonymous key

Optional:
- `VITE_OPENAI_API_KEY` - For AI content generation
- `VITE_STRIPE_PUBLISHABLE_KEY` - For payment processing
- `VITE_STRIPE_PRICE_ID` - Your Stripe price ID

## Documentation

- [Deployment Guide](./DEPLOYMENT_GUIDE.md)
- [Environment Setup](./ENV_SETUP_GUIDE.md)
- [Testing Guide](./TESTING_GUIDE.md)
- [Stripe Setup](./STRIPE_SETUP.md)

## Tech Stack

- React 18 + TypeScript
- Vite
- Tailwind CSS
- Supabase (Auth + Database)
- Stripe (Payments)
- OpenAI (AI Content Generation)

## Support

For issues or questions, please open an issue on GitHub.
