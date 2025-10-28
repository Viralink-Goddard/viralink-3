# Stripe Integration Setup Guide for viralink.pro

## 🎯 Overview
Complete Stripe payment integration for Pro subscription ($10/month) with subscription management.

## 📋 Prerequisites
1. Stripe account (https://dashboard.stripe.com)
2. Supabase project
3. Node.js and npm installed

## 🔧 Step-by-Step Setup

### 1. Install Dependencies
```bash
npm install stripe @stripe/stripe-js
```

### 2. Configure Stripe Dashboard

#### A. Get API Keys
1. Go to https://dashboard.stripe.com/test/apikeys
2. Copy your **Publishable key** (starts with `pk_test_`)
3. Copy your **Secret key** (starts with `sk_test_`)

#### B. Create Product & Price
1. Go to https://dashboard.stripe.com/test/products
2. Click **"+ Add product"**
3. Fill in:
   - Name: `viralink.pro Pro Plan`
   - Description: `Unlimited content generation with advanced AI features`
   - Pricing: `$10.00 USD` / `Recurring` / `Monthly`
4. Click **"Save product"**
5. Copy the **Price ID** (starts with `price_`)

#### C. Set Up Webhook
1. Go to https://dashboard.stripe.com/test/webhooks
2. Click **"+ Add endpoint"**
3. Endpoint URL: `https://YOUR_PROJECT_REF.supabase.co/functions/v1/stripe-webhook`
   - Replace `YOUR_PROJECT_REF` with your Supabase project reference
4. Select events to listen to:
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
5. Click **"Add endpoint"**
6. Copy the **Signing secret** (starts with `whsec_`)

### 3. Configure Environment Variables

#### A. Frontend (.env file)
Create/update `.env` in your project root:
```env
VITE_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_YOUR_KEY
VITE_STRIPE_PRICE_ID=price_YOUR_PRICE_ID
```

#### B. Backend (Supabase Secrets)
Run these commands in your terminal:
```bash
npx supabase secrets set STRIPE_SECRET_KEY=sk_test_YOUR_SECRET_KEY
npx supabase secrets set STRIPE_WEBHOOK_SECRET=whsec_YOUR_WEBHOOK_SECRET
```

### 4. Database Setup
The database schema has already been updated with:
- `stripe_customer_id` - Links user to Stripe customer
- `stripe_subscription_id` - Tracks active subscription
- `subscription_status` - Status (active, canceled, etc.)
- `subscription_end_date` - When subscription renews/ends

### 5. Test the Integration

#### A. Test Checkout Flow
1. Sign up/login to your app
2. Go to Profile page
3. Click **"Upgrade to Pro"**
4. Use Stripe test card: `4242 4242 4242 4242`
   - Any future expiry date
   - Any 3-digit CVC
   - Any ZIP code
5. Complete payment
6. Verify redirect to Profile with success message
7. Check that tier updated to "Pro"

#### B. Test Subscription Management
1. As a Pro user, click **"Manage Subscription"**
2. Verify Stripe Customer Portal opens
3. Test updating payment method
4. Test canceling subscription
5. Verify database updates correctly

#### C. Test Webhook
1. In Stripe Dashboard, go to Webhooks
2. Click on your webhook endpoint
3. Click **"Send test webhook"**
4. Select `customer.subscription.updated`
5. Verify no errors

## 🎨 Features Implemented

### ✅ Checkout Flow
- Secure redirect to Stripe Checkout
- Automatic customer creation
- Subscription creation with metadata
- Success/cancel redirect handling

### ✅ Subscription Management
- Customer Portal integration
- Update payment method
- Cancel subscription
- View invoices and payment history

### ✅ Webhook Processing
- Real-time subscription status updates
- Automatic tier upgrades/downgrades
- Handles subscription lifecycle events

### ✅ UI Components
- SubscriptionManagement component
- Payment status notifications
- Loading states
- Error handling

## 🔒 Security Notes
- API keys stored as environment variables
- Webhook signature verification
- User authentication required
- Row Level Security on database

## 📊 Monitoring
- View transactions: https://dashboard.stripe.com/test/payments
- View subscriptions: https://dashboard.stripe.com/test/subscriptions
- View customers: https://dashboard.stripe.com/test/customers
- View webhook logs: https://dashboard.stripe.com/test/webhooks

## 🚀 Going Live

### Before Production:
1. Switch to live API keys (remove `_test_`)
2. Update webhook endpoint to production URL
3. Test with real payment methods
4. Enable Stripe Radar for fraud prevention
5. Set up email receipts in Stripe Dashboard

### Production Checklist:
- [ ] Live API keys configured
- [ ] Production webhook endpoint set
- [ ] Test real payment flow
- [ ] Email receipts enabled
- [ ] Fraud prevention configured
- [ ] Terms of service updated
- [ ] Privacy policy updated

## 🆘 Troubleshooting

### Payment not completing
- Check Stripe Dashboard logs
- Verify webhook endpoint is accessible
- Check Supabase edge function logs

### Tier not updating
- Verify webhook is receiving events
- Check database permissions
- Review edge function logs

### Customer Portal not opening
- Verify customer ID exists in database
- Check edge function authentication
- Review browser console for errors

## 📚 Additional Resources
- [Stripe Testing](https://stripe.com/docs/testing)
- [Stripe Webhooks](https://stripe.com/docs/webhooks)
- [Supabase Edge Functions](https://supabase.com/docs/guides/functions)
- [Stripe Customer Portal](https://stripe.com/docs/billing/subscriptions/customer-portal)

## 💡 Support
For issues, check:
1. Browser console for frontend errors
2. Supabase edge function logs
3. Stripe Dashboard webhook logs
4. Database query logs
