# Test Database Setup Guide

This guide explains how to set up a test database environment for running integration tests with real Supabase instances.

## Prerequisites

1. **Supabase CLI** installed globally:
   ```bash
   npm install -g supabase
   ```

2. **Separate Supabase Project** for testing (recommended)
   - Create a new project at https://supabase.com
   - Use separate projects for development, testing, and production

## Quick Setup

### 1. Configure Test Environment

Copy the test environment template:
```bash
cp .env.test.example .env.test
```

Update `.env.test` with your test Supabase credentials:
```env
VITE_SUPABASE_URL=https://your-test-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_test_anon_key_here
```

### 2. Run Database Setup Script

```bash
npm run db:setup
```

This script will:
- Run all migrations (create tables, RLS policies, triggers)
- Execute seed data scripts
- Set up test database schema

### 3. Create Test Users

Via Supabase Dashboard:
1. Go to Authentication → Users
2. Add test users:
   - `testuser1@example.com` / `TestPass123!`
   - `testuser2@example.com` / `TestPass123!`
   - `testadmin@example.com` / `AdminPass123!`

Or via API in your tests (recommended):
```typescript
const { data } = await supabase.auth.signUp({
  email: 'test@example.com',
  password: 'TestPassword123!'
});
```

## Running Tests

### Unit Tests (Mocked Supabase)
```bash
npm test
```

### Integration Tests (Real Database)
```bash
npm run test:db
```

### All Tests with UI
```bash
npm run test:ui
```

### Coverage Report
```bash
npm run test:coverage
```

## Database Schema

### Profiles Table
```sql
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  email TEXT NOT NULL,
  tier TEXT DEFAULT 'free',
  entries_today INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### RLS Policies
- Users can SELECT their own profile
- Users can INSERT their own profile
- Users can UPDATE their own profile
- Users can DELETE their own profile

### Automatic Profile Creation
Trigger automatically creates profile when user signs up.

## Test Data Management

### Reset Test Data
```sql
SELECT reset_test_data();
```

### Manual Profile Creation
```sql
SELECT create_test_profile(
  'user-uuid-here',
  'test@example.com',
  'pro',
  5
);
```

## Troubleshooting

### Issue: Migrations fail
- Check Supabase CLI is installed
- Verify database connection
- Check migration syntax

### Issue: RLS policies blocking access
- Verify user is authenticated
- Check policy conditions match test scenario
- Review Supabase logs

### Issue: Trigger not creating profiles
- Check trigger exists: `\df` in psql
- Verify function permissions
- Check auth.users table for new users

## Best Practices

1. **Separate Environments**: Never use production database for tests
2. **Cleanup**: Delete test data after tests complete
3. **Isolation**: Each test should be independent
4. **Idempotency**: Tests should produce same results when run multiple times
5. **Realistic Data**: Use realistic test data that matches production patterns
