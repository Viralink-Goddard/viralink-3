#!/bin/bash

# Setup Test Database Script
# This script sets up the test database with schema and test data

echo "🚀 Setting up test database..."

# Check if Supabase CLI is installed
if ! command -v supabase &> /dev/null; then
    echo "❌ Supabase CLI not found. Install it first:"
    echo "   npm install -g supabase"
    exit 1
fi

# Check if .env.test exists
if [ ! -f .env.test ]; then
    echo "❌ .env.test file not found"
    echo "   Copy .env.test.example and update with your test credentials"
    exit 1
fi

echo "📋 Running migrations..."
supabase db push

echo "🌱 Seeding test data..."
supabase db seed

echo "✅ Test database setup complete!"
echo ""
echo "Next steps:"
echo "1. Create test users via Supabase Dashboard"
echo "2. Run tests with: npm run test:db"
