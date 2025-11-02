# Integration Testing Instructions

Complete guide for running integration tests against real Supabase instances.

## Overview

Integration tests verify that your application works correctly with actual database operations, authentication flows, and RLS policy enforcement.

## Test Types

### 1. Unit Tests (Mocked)
- Fast execution
- No database required
- Test component logic in isolation
- Run with: `npm test`

### 2. Integration Tests (Real DB)
- Test actual database operations
- Verify RLS policies
- Test authentication flows
- Run with: `npm run test:db`

### 3. E2E Tests (Full Stack)
- Test complete user journeys
- Browser automation
- Real API calls
- Run with: `npm run test:e2e` (if configured)

## Setup Process

### Step 1: Create Test Supabase Project

1. Go to https://supabase.com
2. Create new project (name it "YourApp-Test")
3. Wait for provisioning to complete
4. Copy project URL and anon key

### Step 2: Configure Test Environment

Create `.env.test`:
```env
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=your_test_anon_key
VITE_APP_ENV=test
```

### Step 3: Run Database Setup

```bash
npm run db:setup
```

This executes:
- Migration scripts (create tables)
- Seed data scripts (test data)
- Verification checks

### Step 4: Verify Setup

Check Supabase Dashboard:
- [ ] Tables created (profiles, etc.)
- [ ] RLS policies enabled
- [ ] Triggers active
- [ ] Functions deployed

## Running Tests

### Run All Tests
```bash
npm test
```

### Run Database Tests Only
```bash
npm run test:db
```

### Run Specific Test File
```bash
npx vitest run src/test/integration/database-operations.test.tsx
```

### Watch Mode
```bash
npm test -- --watch
```

### With Coverage
```bash
npm run test:coverage
```

### Interactive UI
```bash
npm run test:ui
```

## Test Structure

### Database Operations Test
```typescript
describe('Database Operations', () => {
  beforeAll(async () => {
    // Create test user
    const { data } = await supabase.auth.signUp({
      email: 'test@example.com',
      password: 'TestPass123!'
    });
    testUserId = data.user?.id;
  });

  it('should create profile automatically', async () => {
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', testUserId)
      .single();
    
    expect(data).toBeTruthy();
    expect(data.tier).toBe('free');
  });

  afterAll(async () => {
    // Cleanup test data
    await supabase.from('profiles').delete().eq('id', testUserId);
  });
});
```

## RLS Policy Testing

### Test Read Access
```typescript
it('should allow user to read own profile', async () => {
  // Login as test user
  await supabase.auth.signInWithPassword({
    email: 'test@example.com',
    password: 'TestPass123!'
  });

  // Should succeed
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', testUserId)
    .single();

  expect(error).toBeNull();
  expect(data).toBeTruthy();
});
```

### Test Write Access
```typescript
it('should allow user to update own profile', async () => {
  const { data, error } = await supabase
    .from('profiles')
    .update({ tier: 'pro' })
    .eq('id', testUserId)
    .select()
    .single();

  expect(error).toBeNull();
  expect(data.tier).toBe('pro');
});
```

### Test Access Denial
```typescript
it('should deny access to other user profiles', async () => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', otherUserId)
    .single();

  expect(error).toBeTruthy();
  expect(data).toBeNull();
});
```

## Best Practices

### 1. Test Isolation
Each test should be independent:
```typescript
beforeEach(async () => {
  // Reset state
  await resetTestData();
});
```

### 2. Cleanup
Always clean up test data:
```typescript
afterAll(async () => {
  await deleteTestUsers();
  await deleteTestProfiles();
});
```

### 3. Realistic Data
Use realistic test data:
```typescript
const testUser = {
  email: `test-${Date.now()}@example.com`,
  password: 'SecureTestPass123!',
  tier: 'free'
};
```

### 4. Error Handling
Test both success and failure:
```typescript
it('should handle invalid email', async () => {
  const { error } = await supabase.auth.signUp({
    email: 'invalid-email',
    password: 'pass'
  });
  expect(error).toBeTruthy();
});
```

### 5. Async Operations
Always await async operations:
```typescript
it('should wait for profile creation', async () => {
  await supabase.auth.signUp({...});
  await new Promise(r => setTimeout(r, 1000)); // Wait for trigger
  const { data } = await supabase.from('profiles').select('*');
  expect(data).toBeTruthy();
});
```

## Troubleshooting

### Tests Failing: "Profile not found"
- Wait longer for trigger execution
- Check trigger is active in Supabase
- Verify RLS policies allow access

### Tests Failing: "Permission denied"
- Ensure user is authenticated
- Check RLS policy conditions
- Verify anon key has correct permissions

### Tests Timing Out
- Increase timeout in vitest.config.ts
- Check network connection
- Verify Supabase project is active

## CI/CD Integration

### GitHub Actions Example
```yaml
name: Integration Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - run: npm install
      - run: npm run db:setup
        env:
          VITE_SUPABASE_URL: ${{ secrets.TEST_SUPABASE_URL }}
          VITE_SUPABASE_ANON_KEY: ${{ secrets.TEST_SUPABASE_ANON_KEY }}
      - run: npm run test:db
```

## Next Steps

1. Run unit tests to verify mocked behavior
2. Run integration tests to verify database operations
3. Add more test cases for edge cases
4. Set up CI/CD pipeline
5. Monitor test coverage
