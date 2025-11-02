#!/usr/bin/env node

/**
 * Pre-build environment variable validation script
 * Ensures all required Vite client environment variables are set before building
 */

const requiredEnvVars = [
  {
    name: 'VITE_SUPABASE_URL',
    description: 'Supabase project URL',
    example: 'https://your-project.supabase.co',
    getFrom: 'https://app.supabase.com/project/_/settings/api'
  },
  {
    name: 'VITE_SUPABASE_ANON_KEY',
    description: 'Supabase anonymous/public key',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    getFrom: 'https://app.supabase.com/project/_/settings/api'
  },
  {
    name: 'VITE_STRIPE_PUBLISHABLE_KEY',
    description: 'Stripe publishable key',
    example: 'pk_live_51ABC...',
    getFrom: 'https://dashboard.stripe.com/apikeys'
  },
  {
    name: 'VITE_STRIPE_PRICE_ID',
    description: 'Stripe price ID for Pro subscription',
    example: 'price_1ABC...',
    getFrom: 'https://dashboard.stripe.com/products'
  },
  {
    name: 'VITE_OPENAI_API_KEY',
    description: 'OpenAI API key for AI features',
    example: 'sk-...',
    getFrom: 'https://platform.openai.com/api-keys',
    optional: true // AI features can be disabled if not provided
  }
];

console.log('🔍 Checking environment variables for build...\n');

let hasErrors = false;
const missingVars = [];
const warnings = [];

for (const envVar of requiredEnvVars) {
  const value = process.env[envVar.name];
  
  if (!value || value === '' || value === 'undefined') {
    if (envVar.optional) {
      warnings.push(envVar);
      console.log(`⚠️  WARNING: ${envVar.name} is not set (optional)`);
    } else {
      hasErrors = true;
      missingVars.push(envVar);
      console.log(`❌ ERROR: ${envVar.name} is not set (required)`);
    }
  } else if (value.includes('your_') || value.includes('placeholder')) {
    if (envVar.optional) {
      warnings.push(envVar);
      console.log(`⚠️  WARNING: ${envVar.name} appears to be a placeholder value`);
    } else {
      hasErrors = true;
      missingVars.push(envVar);
      console.log(`❌ ERROR: ${envVar.name} appears to be a placeholder value`);
    }
  } else {
    console.log(`✅ ${envVar.name} is set`);
  }
}

console.log('\n' + '='.repeat(60));

if (hasErrors) {
  console.error('\n❌ BUILD FAILED: Required environment variables are missing or invalid\n');
  console.error('To fix this issue:\n');
  console.error('1. In Netlify UI, go to Site Settings > Environment Variables');
  console.error('2. Add the following environment variables:\n');
  
  for (const envVar of missingVars) {
    console.error(`   ${envVar.name}:`);
    console.error(`   - Description: ${envVar.description}`);
    console.error(`   - Example: ${envVar.example}`);
    console.error(`   - Get from: ${envVar.getFrom}\n`);
  }
  
  console.error('3. After adding all variables, click "Clear cache and deploy site"\n');
  console.error('For local development, copy .env.example to .env and fill in the values.\n');
  
  process.exit(1);
} else if (warnings.length > 0) {
  console.log('\n⚠️  Build proceeding with warnings:');
  console.log('   Some optional features may be disabled.\n');
} else {
  console.log('\n✅ All required environment variables are properly configured!\n');
}

console.log('📦 Proceeding with build...\n');