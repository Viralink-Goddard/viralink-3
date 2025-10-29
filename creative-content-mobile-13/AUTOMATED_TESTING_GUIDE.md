# Automated Testing Guide

## Overview
This guide covers the automated test suite for the authentication system using Vitest and React Testing Library.

## Test Structure

### 1. Unit Tests (`src/contexts/__tests__/AuthContext.test.tsx`)
Tests the AuthContext in isolation:
- ✅ Context provider setup
- ✅ Hook usage validation
- ✅ Error handling for missing provider
- ✅ State management

### 2. Integration Tests (`src/test/integration/auth-flow.test.tsx`)
Tests complete authentication flows:
- ✅ Signup flow with mocked Supabase
- ✅ Login flow with mocked Supabase
- ✅ Logout flow
- ✅ Session management
- ✅ Profile fetching

### 3. Mock Setup (`src/test/mocks/supabase.ts`)
Provides mock Supabase client:
- Mock user data
- Mock session data
- Mock profile data
- Mock auth methods (signUp, signIn, signOut, etc.)

## Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run tests with UI
npm run test:ui

# Run tests with coverage
npm run test:coverage
```

## Test Coverage Goals
- Unit Tests: 90%+ coverage
- Integration Tests: 80%+ coverage
- E2E Tests: Critical paths covered

## Writing New Tests

### Example Unit Test
```typescript
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';

describe('MyComponent', () => {
  it('renders correctly', () => {
    render(<MyComponent />);
    expect(screen.getByText('Hello')).toBeInTheDocument();
  });
});
```

### Example Integration Test
```typescript
import userEvent from '@testing-library/user-event';

it('handles user interaction', async () => {
  const user = userEvent.setup();
  render(<MyForm />);
  
  await user.type(screen.getByLabelText('Email'), 'test@example.com');
  await user.click(screen.getByRole('button', { name: 'Submit' }));
  
  await waitFor(() => {
    expect(screen.getByText('Success')).toBeInTheDocument();
  });
});
```

## Best Practices
1. Always clean up after tests
2. Use meaningful test descriptions
3. Test user interactions, not implementation details
4. Mock external dependencies (Supabase, APIs)
5. Use data-testid for elements that are hard to query
6. Test error states and edge cases
7. Keep tests focused and isolated
